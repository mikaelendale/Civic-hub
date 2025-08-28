'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: boolean;
    created_at?: string;
}

interface UsersManagementProps {
    users: User[];
}

const ITEMS_PER_PAGE = 10;

export default function UsersManagement({ users = [] }: UsersManagementProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Filter users based on search term
    const filteredUsers = useMemo(() => {
        if (!users || users.length === 0) return [];

        return users.filter(
            (user) => user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
        );
    }, [users, searchTerm]);

    // Pagination logic
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleBanToggle = async (userId: number) => {
        console.log('Toggle ban for user:', userId);
        // Add your API call here
    };

    const handlePlanChange = async (userId: number, newPlan: string) => {
        console.log('Change plan for user:', userId, 'to:', newPlan);
        // Add your API call here
    };

    const getPlanBadgeVariant = (plan?: string) => {
        switch (plan?.toLowerCase()) {
            case 'enterprise':
                return 'default';
            case 'pro':
                return 'secondary';
            case 'basic':
                return 'outline';
            default:
                return 'outline';
        }
    };

    return (
        <AppLayout>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex justify-between">
                    <h2 className="text-lg font-medium">User Managment </h2>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Show message if no users */}
                {!users || users.length === 0 ? (
                    <div className="py-12 text-center">
                        <p className="text-muted-foreground">No users found in the system.</p>
                    </div>
                ) : (
                    <>
                        {/* Single Responsive Table */}
                        <div className="overflow-hidden rounded-lg border bg-card shadow-none">
                            <div className="overflow-x-auto">
                                <Table className=''>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="min-w-[150px]">Name</TableHead>
                                            <TableHead className="min-w-[200px]">Email</TableHead>
                                            <TableHead className="min-w-[150px]">Email Verified</TableHead>
                                            <TableHead className="min-w-[150px]">Created At</TableHead>
                                            <TableHead className="min-w-[100px]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedUsers.map((user) => {
                                            return (
                                                <TableRow key={user.id}>
                                                    <TableCell className="font-medium">{user.name}</TableCell>
                                                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        <Badge variant={'default'} className={user.email_verified_at ? 'bg-green-400 text-black' : 'bg-red-400'}>
                                                            {user.email_verified_at ? 'Verified' : 'Unverified'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                variant={'outline'}
                                                                size="sm"
                                                                className="px-2 text-xs"
                                                                onClick={() => router.get(route('admin.users.show', user.id))}
                                                            >
                                                                View
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredUsers.length)} of{' '}
                                    {filteredUsers.length} users
                                </div>
                                <div className="flex items-center justify-center gap-2 sm:justify-end">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="flex items-center gap-1"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </Button>

                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                            let page;
                                            if (totalPages <= 5) {
                                                page = i + 1;
                                            } else if (currentPage <= 3) {
                                                page = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                page = totalPages - 4 + i;
                                            } else {
                                                page = currentPage - 2 + i;
                                            }
                                            return (
                                                <Button
                                                    key={page}
                                                    variant={currentPage === page ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => setCurrentPage(page)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    {page}
                                                </Button>
                                            );
                                        })}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="flex items-center gap-1"
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* No results message */}
                        {filteredUsers.length === 0 && users.length > 0 && (
                            <div className="py-12 text-center">
                                <p className="text-muted-foreground">No users found matching your search.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </AppLayout>
    );
}
