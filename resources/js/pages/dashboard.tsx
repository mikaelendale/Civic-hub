import Microservices from '@/components/microservices';
import { Button } from '@/components/ui/button';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowUpLeft, ArrowUpRight } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
    },
];


export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex justify-between">
                    <h2 className="text-lg font-medium">Welcome back, {auth.user.name}!</h2>
                    {auth.roles.includes('admin') && <Button className='w-auto justify-end' variant="link"><Link href="/admin/dashboard" className='inline-block'>Admin</Link><ArrowUpRight className='ml-2 h-4 w-4' /> </Button>}
                </div>
                <Microservices />
            </div>
        </AppLayout>
    );
}
