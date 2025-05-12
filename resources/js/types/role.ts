// types/role.ts
export interface Permission {
    id: number;
    name: string;
}

export interface Role {
    id: number;
    name: string;
    permissions?: Permission[];
    created_at?: string;
    updated_at?: string;
}