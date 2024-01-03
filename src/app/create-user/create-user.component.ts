import { Component } from '@angular/core';
import { CreateUserService } from '../services/create-user.service';
import { RoleService } from '../services/role.service';
import { Role } from '../interface/role';
import { User } from '../models/User.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {

  userModel: User = new User();
 roles: Role[] = []; // Array to store role names
 selectedRole: Role | null = null;


 constructor(private createuserservice: CreateUserService,
  private roleService: RoleService,
  private toastrService: ToastrService,
  private router: Router) {}


  ngOnInit() {
    this.getRoles();
  }

  getRoles() {
    this.roleService.getRoles().subscribe(
      (response) => {
       // this.roles = response?.result.map((role: Role) => role.roleName) || [];
       this.roles = response?.result || [];
       console.log('Roles:', this.roles);
      },
      (error) => {
        console.error('Error getting roles', error);
      }
    );
  }

  onRoleSelected(selectedRole: Role | null) {
    if (selectedRole !== null && selectedRole !== undefined) {
      console.log('Selected role ID:', selectedRole.id);
      console.log('Selected role Name:', selectedRole.roleName);

   // Assign the selected role name to the userModel's role property
    this.userModel.role = selectedRole.roleName;
    } else {
      console.log('error');
    }
  }
  
 createUser() {
   // Check if a role is selected
   if (this.selectedRole) {
    // Assign selected role information to userModel
    this.userModel.roleId = this.selectedRole.id;
    this.userModel.role = this.selectedRole.roleName;
  }
  console.log('User Model:', this.userModel);
  this.createuserservice.createUser(this.userModel).subscribe(
    
    (response) => {
      
      console.log('User created successfully', response);
      this.toastrService.success('User created successfully');
      // Reset the userModel to clear the form fields
      this.userModel = new User();
      this.router.navigate(['/list-user']);
    },
    (error) => {
      console.error('Error creating user', error);
      this.toastrService.error('Error creating user');
    }
  );
}

logout() {
  this.router.navigate(['']);
 }

// validation-dob
getMaxDOB(): string {
  const today = new Date();
  today.setFullYear(today.getFullYear() - 18);
  return today.toISOString().split('T')[0];
}

//password
showPassword = false;

togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}

backtolanding(){
  this.router.navigate(['/']);
}


}
