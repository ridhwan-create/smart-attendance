import { Company } from './company';
import { Department } from './department';

export interface Employee {
    id: number;
    ic_number: string;
    name: string;
    email: string;
    phone: string;
    position: string;
    company_id: number;
    department_id: number;
    company?: Company;
    department?: Department;
    created_at?: string;
    updated_at?: string;
}
