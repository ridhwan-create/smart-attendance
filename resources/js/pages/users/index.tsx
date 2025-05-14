import React, { useEffect } from 'react'; // Tambahkan useEffect
import { Head, Link, useForm, router } from '@inertiajs/react'; // Tambahkan router
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/ui/pagination';
import { Eye, Pencil, Plus } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

// ... (interface dan breadcrumbs tetap sama)
interface BreadcrumbItem {
    title: string;
    href: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    roles: { id: number; name: string }[];
    created_at: string;
}

interface PaginatedData<T> {
    data: T[];
    links: any[];
    meta: any;
    from?: number;
}

type PageProps = {
    users: PaginatedData<User>;
    roles: Record<number, string>;
    filters: {
        search: string;
        perPage: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/users' },
];

export default function UserIndex({ users, roles, filters }: PageProps) {

    const Pagination = ({ links }: { links: any[] }) => {
        const handleClick = (url: string | null) => {
            if (!url) return;
            get(url, {
                preserveScroll: true,
                preserveState: true,
                only: ['users'],
            });
        };

        return (
            <div className="flex gap-2">
                {links.map((link, index) => (
                    <Button
                        key={index}
                        variant={link.active ? 'default' : 'outline'}
                        disabled={!link.url}
                        onClick={() => handleClick(link.url)}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        );
    };

    const { data, setData, get } = useForm({
        search: filters.search || '',
        perPage: filters.perPage || '10',
    });

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        get(route('users.index'), {
            preserveState: true,
            preserveScroll: true,
            only: ['users'],
        });
    };

    // Tambahkan useEffect untuk handle perubahan perPage
    useEffect(() => {
        if (data.perPage !== filters.perPage) {
            router.get(route('users.index'), {
                perPage: data.perPage,
                search: data.search,
            }, {
                preserveState: true,
                preserveScroll: true,
                only: ['users'],
            });
        }
    }, [data.perPage]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Users</h1>
                    <Button asChild variant="success" className="rounded p-3">
                        <Link href={route('users.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add User
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <form onSubmit={handleSearch} className="flex items-center gap-2">
                        <Input
                            name="search"
                            value={data.search}
                            onChange={(e) => setData('search', e.target.value)}
                            placeholder="Search user name..."
                            className="max-w-sm"
                        />
                        <Button type="submit">Search</Button>
                    </form>

                    <div className="w-full sm:w-auto">
                        <Select
                            value={data.perPage}
                            onValueChange={(value) => setData('perPage', value)}
                        >
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Select per page" />
                            </SelectTrigger>
                            <SelectContent>
                                {[10, 25, 50, 100].map((value) => (
                                    <SelectItem key={value} value={String(value)}>
                                        {value} per page
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-md border">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-muted text-left">
                                <th className="p-3 whitespace-nowrap">#</th>
                                <th className="p-3 whitespace-nowrap">Name</th>
                                <th className="p-3 whitespace-nowrap">Email</th>
                                <th className="p-3 whitespace-nowrap">Role</th>
                                <th className="p-3 whitespace-nowrap">Registration Date</th>
                                <th className="p-3 whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-4 text-center text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.data.map((user, index) => (
                                    <tr key={user.id} className="border-t">
                                        <td className="p-3 whitespace-nowrap">{(users.from ?? 0) + index}</td>
                                        <td className="p-3 whitespace-nowrap">{user.name}</td>
                                        <td className="p-3 whitespace-nowrap">{user.email}</td>
                                        <td className="p-3 whitespace-nowrap">
                                            {user.roles.map((role) => role.name).join(', ')}
                                        </td>
                                        <td className="p-3 whitespace-nowrap">{user.created_at}</td>
                                        <td className="p-3 flex gap-2">
                                            <Link
                                                href={route('users.show', user.id)}
                                                className="text-indigo-600 hover:underline"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <Link
                                                href={route('users.edit', user.id)}
                                                className="text-yellow-600 hover:underline"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    <Pagination links={users.links} />
                </div>
            </div>

        </AppLayout>
    );
}