import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/ui/pagination';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';

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
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/users' },
];

export default function UserIndex({ users, roles, filters }: PageProps) {
    const { data, setData, get } = useForm({
        search: filters.search || '',
    });

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        get(route('users.index'), {
            preserveState: true,
            preserveScroll: true,
            only: ['users'],
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Senarai Pengguna</h1>
                    <Button asChild variant="success" className="rounded p-3">
                        <Link href={route('users.create')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add User
                        </Link>
                    </Button>
                </div>

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

                <div className="overflow-x-auto">
                    <table className="min-w-full border rounded-md">
                        <thead>
                            <tr className="text-left text-sm bg-muted">
                                <th className="p-3">#</th>
                                <th className="p-3">Name</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Role</th>
                                <th className="p-3">Registration Date</th>
                                <th className="p-3">Actions</th>
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
                                    <tr key={user.id} className="border-t text-sm">
                                        <td className="p-3">{(users.from ?? 0) + index}</td>
                                        <td className="p-3">{user.name}</td>
                                        <td className="p-3">{user.email}</td>
                                        <td className="p-3">
                                            {user.roles.map(role => role.name).join(', ')}
                                        </td>
                                        <td className="p-3">{user.created_at}</td>
                                        <td className="p-3 space-x-2 flex gap-2">
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

                <Pagination links={users.links} />
            </div>
        </AppLayout>
    );
}