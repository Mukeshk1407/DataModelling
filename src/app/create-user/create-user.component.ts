import { Component } from '@angular/core';
import { User } from '../models/User.model';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthStorageService } from '../services/authstorage.service';
import { UserService } from '../services/user.service';
import { Role } from '../models/Role';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
})
export class CreateUserComponent {
  userModel: User = new User();
  roles: Role[] = []; // Array to store role names
  selectedRole: Role | null = null;

  constructor(
    private userService: UserService,
    private toastrService: ToastrService,
    private authStorageService: AuthStorageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getRoles();
  }

  getRoles() {
    this.userService.getRoles().subscribe(
      (response) => {
        this.roles = response?.result || [];
      },
      (error) => {}
    );
  }

  onRoleSelected(selectedRole: Role | null) {
    if (selectedRole !== null && selectedRole !== undefined) {
      // Assign the selected role name to the userModel's role property
      this.userModel.role = selectedRole.roleName;
    } else {
    }
  }

  createUser() {
    // Check if a role is selected
    if (this.selectedRole) {
      // Assign selected role information to userModel
      this.userModel.roleId = this.selectedRole.id;
      this.userModel.role = this.selectedRole.roleName;
    }
    this.userService.createUser(this.userModel).subscribe(
      (response) => {
        this.toastrService.success('User created successfully');
        // Reset the userModel to clear the form fields
        this.userModel = new User();
        this.router.navigate(['/list-user']);
      },
      (error) => {
        this.toastrService.error('Error creating user');
      }
    );
  }

  logout() {
    this.authStorageService.clearAuthInfo();
    this.router.navigate(['']);
  }
  BacktoList() {
    this.router.navigate(['/list-user']);
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

  backtolanding() {
    this.router.navigate(['/']);
  }
}
