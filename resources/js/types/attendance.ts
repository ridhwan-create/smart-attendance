import { Company } from './company';
import { Department } from './department';
import { Location } from './location';
import { WorkScheduleType } from './work-schedule-type';
import { Employee } from './employee';

export type Attendance = {
    id: number;
    employee_id: number;
    ic_number: string;
    name: string;
    check_in_time: string;
    check_out_time: string;
    location_id: number;
    notes: string;
    company_id: number;
    work_schedule_type_id: number;
    company?: Company;
    department?: Department;
    location?: Location;
    work_schedule_type?: WorkScheduleType;
    employee?: Employee;
    created_at?: string;
    updated_at?: string;
    created_by?: string;
    updated_by?: string;
};
