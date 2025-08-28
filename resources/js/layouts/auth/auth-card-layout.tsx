import AppLogoIcon from '@/components/app-logo-icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 bg-[url('/bg2.jpg')] bg-cover bg-center relative">
            <div className="absolute inset-0 bg-[url('/bg2.jpg')] bg-cover bg-center blur-sm z-0" />
            <div className="relative z-10 w-full flex flex-col items-center"></div>
            <div className="flex w-full max-w-md flex-col gap-6 z-10">
                <div className="flex flex-col gap-6">
                    <Card className="rounded-3xl ring-8 ring-white/30 dark:ring-accent/30 ">
                        <Link href={route('home')} className="flex items-center gap-2 self-center font-medium">
                            <div className="flex h-9 w-9 items-center justify-center">
                                <AppLogoIcon className="size-9 fill-current text-black dark:text-white" />
                            </div>
                        </Link>
                        <CardHeader className="px-10 text-center">
                            <CardTitle className="text-xl">{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pb-10 py-8">{children}</CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
