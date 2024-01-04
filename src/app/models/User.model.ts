// log-details.dto.ts
export class User {
    id: number = 0;
    name: string = '';
    roleId: number = 0;
    email: string = '';
    password?: string = '';
    phonenumber: number = 0;
    gender: string = '';
    dob: Date | null = null;
    role: string = '';
    roleName: string; 
    status: boolean = false;
  }