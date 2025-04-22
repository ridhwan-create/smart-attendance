import React from 'react';
import { Link } from '@inertiajs/react';

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export default function Pagination({ links }: { links: PaginationLink[] }) {
    return (
        <div className="flex justify-center mt-4 gap-1 flex-wrap">
            {links.map((link, i) => (
                <Link
                    key={i}
                    href={link.url ?? ''}
                    className={`px-3 py-1 border text-sm rounded ${link.active ? 'bg-primary text-white' : 'hover:bg-muted'} ${!link.url ? 'pointer-events-none text-gray-400' : ''}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}
