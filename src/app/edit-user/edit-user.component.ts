import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UserInfoService } from '../services/user-info.service';

interface UserData {
  id: number;
  name: string;
  roleId: number;
  email: string;
  phonenumber: string;
  gender: string;
  dob: string;
  status: boolean;
}
import { UserTableDTO } from '../models/user-table.dto';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css'],
})
export class EditUserComponent implements OnInit {
  userId!: number;
  user: UserData = {
    id: 0,
    name: '',
    roleId: 0,
    email: '',
    phonenumber: '',
    gender: '',
    dob: '',
    status: false,
  };
  entityName: string = '';
  updateSuccess = false;
  roles: any[] = []; // Add this property to store roles
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userInfoService: UserInfoService
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = +params['id'];
      this.getUserDetails(this.userId);
      this.loadRoles();
    });
  }
  getUserDetails(userId: number): void {
    this.userInfoService.getUserById(userId).subscribe(
      (response: any) => {
        if (response.isSuccess) {
          console.log('Received user details:', response.result);
          this.user = response.result;
        } else {
          console.error('Error fetching user details:', response);
          this.user = {} as UserData;
        }
      },
      (error) => {
        console.error('Error fetching user details:', error);
        this.user = {} as UserData;
      }
    );
  }

  loadRoles(): void {
    this.userInfoService.getRoles().subscribe(
      (response: any) => {
        if (response.isSuccess) {
          console.log('Received roles:', response.result);
          this.roles = response.result;
        } else {
          console.error('Error fetching roles:', response);
          this.roles = [];
        }
      },
      (error) => {
        console.error('Error fetching roles:', error);
        this.roles = [];
      }
    );
  }

  onSubmit(): void {
    // Ensure the user object is properly populated with updated data
    this.userInfoService.updateUserById(this.userId, this.user).subscribe(
      (response) => {
        console.log('User updated successfully:', response);
        // Optionally, you can redirect to another page or perform other actions upon successful update
        this.router.navigate(['list-user']);
      },
      (error) => {
        console.error('Error updating user:', error);
        // Handle error as needed
      }
    );
  }

  BacktoView(entityName: string) {
    this.router.navigate([`entity/${entityName}`]);
    localStorage.removeItem('logDetailsData');
    // Dispatch the logout action
    // this.store.dispatch(authActions.logout());
  }
}
