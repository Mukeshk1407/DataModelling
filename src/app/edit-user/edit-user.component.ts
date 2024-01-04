import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { UserInfoService } from '../services/user-info.service';
import { AuthStorageService } from '../services/authstorage.service';
import { ConnectdatabaseComponent } from '../connectdatabase/connectdatabase.component';
import { MatDialog } from '@angular/material/dialog';
import { UserTableDTO } from '../models/user-table.dto';
interface UserData {
  id: number;
  name: string;
  roleId: number;
  roleName: string; // Add this line
  email: string;
  password?: string;
  phonenumber: string;
  gender: string;
  dob: string;
  status: boolean;
}

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
    roleName: '', // Add this line
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
    private userInfoService: UserInfoService,private authStorageService: AuthStorageService,private dialog:MatDialog
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
          this.user = {
            id: response.result.id,
            name: response.result.name,
            roleId: response.result.roleId,
            roleName: '', // Initialize roleName, it will be filled later
            email: response.result.email,
            phonenumber: response.result.phonenumber,
            gender: response.result.gender,
            dob: response.result.dob,
            status: response.result.status,
          };

          // Fetch the role name for the user
          this.userInfoService.getRoleById(this.user.roleId).subscribe(
            (roleResponse: any) => {
              if (roleResponse.isSuccess) {
                this.user.roleName = roleResponse.result;
              } else {
                console.error('Error fetching role:', roleResponse.error);
              }
            },
            (error) => {
              console.error('Error fetching role:', error);
            }
          );
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
    this.user.password = ''; 
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
  logout() {
    localStorage.removeItem('logDetailsData');
    this.authStorageService.clearAuthInfo();
      this.router.navigate(['']);
  }
  switchView() {
    // Clear localStorage data
 localStorage.removeItem('databaseDetails');
   this.router.navigate(['']);

   const dialogRef = this.dialog.open(ConnectdatabaseComponent, {
     width: '400px',
     disableClose:true
   });
 
   dialogRef.afterClosed().subscribe((result: string | undefined) => {
     if (result) {
       // Handle the selected database
       console.log('Selected Database:', result);
     } else {
       // Handle modal close event
       console.log('Modal closed');
     }
   });
 }
}
