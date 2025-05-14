import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, ArrowLeft } from 'lucide-react';

interface BreadcrumbItem {
    title: string;
    href: string;
}

interface Role {
    id: number;
    name: string;
}

type PageProps = {
    user: {
        id: number;
        name: string;
        email: string;
        roles: Role[];
        created_at: string;
        updated_at: string;
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/users' },
    { title: 'User Details', href: '#' },
];

export default function UserShow({ user }: PageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="User Details" />
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <Button asChild variant="ghost" className="rounded p-3">
                        <Link href={route('users.index')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Users
                        </Link>
                    </Button>
                    <Button asChild variant="default" className="rounded p-3">
                        <Link href={route('users.edit', user.id)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit User
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>User Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <div>
                                    <p className="text-sm text-muted-foreground">Name</p>
                                    <p className="text-base font-medium">{user.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <p className="text-base font-medium">{user.email}</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <p className="text-sm text-muted-foreground">Created At</p>
                                    <p className="text-base font-medium">{user.created_at}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Last Updated</p>
                                    <p className="text-base font-medium">{user.updated_at}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <p className="text-sm text-muted-foreground">Roles</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {user.roles.length > 0 ? (
                                    user.roles.map((role) => (
                                        <Badge key={role.id} variant="secondary">
                                            {role.name}
                                        </Badge>
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500">No roles assigned</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}