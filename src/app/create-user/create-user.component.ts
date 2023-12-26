import { Component } from '@angular/core';
import { CreateUserService } from '../services/create-user.service';
import { RoleService } from '../services/role.service';
import { Role } from '../interface/role';


@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {

 userModel: any = {};
 roles: string[] = []; // Array to store role names

 constructor(private createuserservice: CreateUserService,
  private roleService: RoleService) {}


  ngOnInit() {
    this.getRoles();
    console.log("role", this.getRoles())
  }

  getRoles() {
    this.roleService.getRoles().subscribe(
      (response) => {
        console.log('API Response:', response); 
        this.roles = response?.result.map((role: Role) => role.roleName) || [];
        console.log("Roles", this.roles); // Log roles here
      },
      (error) => {
        console.error('Error getting roles', error);
      }
    );
  }

 createUser() {
  this.createuserservice.createUser(this.userModel).subscribe(
    (response) => {
      console.log('User created successfully', response);
    },
    (error) => {
      console.error('Error creating user', error);
    }
  );
}
}
