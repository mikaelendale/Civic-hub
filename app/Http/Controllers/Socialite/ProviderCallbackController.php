<?php

namespace App\Http\Controllers\Socialite;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\WelcomeNotification;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\InvalidStateException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Auth\Events\Registered;

class ProviderCallbackController extends Controller
{
    private const SUPPORTED_PROVIDERS = ['github', 'google'];

    private function validateSocialUser($socialUser): ?string
    {
        if (empty($socialUser->email)) {
            return 'Email address is required but not provided by the authentication provider.';
        }

        if (empty($socialUser->id)) {
            return 'User ID is required but not provided by the authentication provider.';
        }

        if (!filter_var($socialUser->email, FILTER_VALIDATE_EMAIL)) {
            return 'Invalid email format provided by the authentication provider.';
        }

        return null;
    }

    private function generateUsername($socialUser, string $provider): string
    {
        // If name is provided, use it
        if (!empty($socialUser->name)) {
            return $socialUser->name;
        }

        // Generate a username based on provider
        switch ($provider) {
            case 'github':
                return $socialUser->nickname ?? 'GitHubUser_' . Str::random(8);
            case 'google':
                return explode('@', $socialUser->email)[0] ?? 'GoogleUser_' . Str::random(8);
            default:
                return 'User_' . Str::random(8);
        }
    }

    private function extractProfileUrl($socialUser, string $provider): ?string
    {
        // Handle different providers' profile URL structures
        switch ($provider) {
            case 'github':
                return $socialUser->user['html_url'] ?? null;
            case 'google':
                return $socialUser->avatar ?? null;
            default:
                return null;
        }
    }

    private function handleExistingUser(User $user, $socialUser, string $provider): User
    {
        // Check if user has a password (registered with email/password)
        if (!empty($user->password)) {
            throw new \Exception("This email is already registered with email and password. Please sign in using your email and password, or reset your password if you've forgotten it.");
        }

        // Check for provider conflicts
        if ($user->provider_name && $user->provider_name !== $provider) {
            throw new \Exception("This email is already registered with {$user->provider_name}. Please use {$user->provider_name} to sign in or use a different email address.");
        }

        // Check for provider ID conflicts
        if ($user->provider_id && $user->provider_id !== $socialUser->id && $user->provider_name === $provider) {
            throw new \Exception("This {$provider} account is already linked to a different user. Please use the correct {$provider} account.");
        }

        // Update user data
        $updateData = [
            'provider_token' => $socialUser->token,
            'provider_refresh_token' => $socialUser->refreshToken,
        ];

        // Add profile URL if available
        $profileUrl = $this->extractProfileUrl($socialUser, $provider);
        if ($profileUrl) {
            $updateData['profile_url'] = $profileUrl;
        }

        // Update name if it's empty or different
        $generatedName = $this->generateUsername($socialUser, $provider);
        if (empty($user->name) || $user->name !== $generatedName) {
            $updateData['name'] = $generatedName;
        }

        // Ensure email is verified for social logins
        if (empty($user->email_verified_at)) {
            $updateData['email_verified_at'] = now();
        }

        // Link provider if not already linked
        if (!$user->provider_id) {
            $updateData['provider_id'] = $socialUser->id;
            $updateData['provider_name'] = $provider;
        }

        $user->update($updateData);
        return $user;
    }

    private function createNewUser($socialUser, string $provider): User
    {
        $userData = [
            'name' => $this->generateUsername($socialUser, $provider),
            'email' => $socialUser->email,
            'provider_id' => $socialUser->id,
            'provider_name' => $provider,
            'provider_token' => $socialUser->token,
            'provider_refresh_token' => $socialUser->refreshToken,
            'email_verified_at' => now(), // Auto-verify email for social logins
        ];

        // Add profile URL if available
        $profileUrl = $this->extractProfileUrl($socialUser, $provider);
        if ($profileUrl) {
            $userData['profile_url'] = $profileUrl;
        }

        $user = User::create($userData);

        // Assign role if method exists
        if (method_exists($user, 'assignRole')) {
            $user->assignRole('user');
        }

        // Fire the Registered event for new social users
        event(new Registered($user));

        $user->notify(new WelcomeNotification());
        return $user;
    }

    public function __invoke(string $provider): RedirectResponse
    {
        if (!in_array($provider, self::SUPPORTED_PROVIDERS, true)) {
            Log::warning('Unsupported provider callback attempted', ['provider' => $provider]);
            return redirect()->route('login')->with([
                'error' => 'Unsupported authentication provider.'
            ]);
        }

        try {
            // Request offline access for Google to get refresh token
            if ($provider === 'google') {
                $socialUser = Socialite::driver($provider)
                    ->with(['access_type' => 'offline', 'prompt' => 'consent select_account'])
                    ->user();
            } else {
                $socialUser = Socialite::driver($provider)->user();
            }

            // DEBUG: Log all received data
            Log::debug('Socialite user data', [
                'provider' => $provider,
                'user_data' => [
                    'id' => $socialUser->getId(),
                    'name' => $socialUser->getName(),
                    'email' => $socialUser->getEmail(),
                    'avatar' => $socialUser->getAvatar(),
                    'token' => $socialUser->token,
                    'refreshToken' => $socialUser->refreshToken,
                    'raw' => $socialUser->user,
                ]
            ]);

            // Validate social user data (removed name requirement)
            $validationError = $this->validateSocialUser($socialUser);
            if ($validationError) {
                Log::warning('Invalid social user data', [
                    'provider' => $provider,
                    'error' => $validationError
                ]);
                return redirect()->route('login')->with(['error' => $validationError]);
            }

            DB::beginTransaction();

            try {
                // Find existing user
                $existingUser = User::where(function ($query) use ($socialUser, $provider) {
                    $query->where('email', $socialUser->email)
                        ->orWhere(function ($subQuery) use ($socialUser, $provider) {
                            $subQuery->where('provider_id', $socialUser->id)
                                ->where('provider_name', $provider);
                        });
                })->first();

                if ($existingUser) {
                    $user = $this->handleExistingUser($existingUser, $socialUser, $provider);
                    $isNewUser = false;
                } else {
                    $user = $this->createNewUser($socialUser, $provider);
                    $isNewUser = true;
                }

                DB::commit();

                Log::info('Successful social authentication', [
                    'provider' => $provider,
                    'user_id' => $user->id,
                    'email' => $user->email,
                    'name' => $user->name,
                    'is_new_user' => $isNewUser,
                    'has_refresh_token' => !empty($user->provider_refresh_token),
                    'has_profile_url' => !empty($user->profile_url),
                    'email_verified' => !empty($user->email_verified_at)
                ]);

                Auth::login($user, true);
                session()->forget('referral_code');

                $message = $isNewUser
                    ? "Welcome! Successfully registered with " . ucfirst($provider) . "!"
                    : "Successfully signed in with " . ucfirst($provider) . "!";

                return redirect()->intended('/dashboard')->with('success', $message);
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (InvalidStateException $e) {
            Log::warning('Invalid state exception during social auth', [
                'provider' => $provider,
                'error' => $e->getMessage()
            ]);
            return redirect()->route('login')->with([
                'error' => 'Authentication session expired. Please try again.'
            ]);
        } catch (\Exception $e) {
            Log::error('Social authentication error', [
                'provider' => $provider,
                'error' => $e->getMessage()
            ]);

            $errorMessage = $e->getMessage();
            if (Str::contains($errorMessage, ['already registered with', 'already linked to'])) {
                return redirect()->route('login')->with(['error' => $errorMessage]);
            }

            return redirect()->route('login')->with([
                'error' => 'Authentication failed. Please try again or contact support if the problem persists.'
            ]);
        }
    }
}
