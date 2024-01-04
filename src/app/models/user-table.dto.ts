export interface UserTableDTO{
    id: number;
    name: string;
    roleId: number;
    email:string;
    password?: string;
    phonenumber: number;
    gender: string;
    dob: string;
    status: boolean;
    role?: string;
    roleName?: string;
}