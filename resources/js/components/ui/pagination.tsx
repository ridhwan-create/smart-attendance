import React from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from './button';

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface Props {
  links: PaginationLink[];
  onNavigate?: () => void; // optional: callback untuk trigger setIsSubmitted(true)
}

const Pagination: React.FC<Props> = ({ links, onNavigate }) => {
  const { data, get } = useForm();

  const handleClick = (url: string | null) => {
    if (!url) return;

    get(url, {
      preserveScroll: true,
      preserveState: true,
      only: ['attendances'],
      onSuccess: () => {
        onNavigate?.(); // trigger semula isSubmitted
      },
    });
  };

  return (
    <div className="flex gap-2 flex-wrap mt-4">
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

export default Pagination;
