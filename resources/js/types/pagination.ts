// resources/js/types/pagination.ts

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export interface PaginationFilters {
    search?: string;
    [key: string]: any; // Untuk support filter tambahan di masa depan
}
