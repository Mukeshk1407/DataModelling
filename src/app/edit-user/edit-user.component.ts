import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthStorageService } from '../services/authstorage.service';
import { ConnectdatabaseComponent } from '../connectdatabase/connectdatabase.component';
import { MatDialog } from '@angular/material/dialog';
import { UserTableDTO } from '../models/user-table.dto';
import { UserService } from '../services/user.service';
interface UserData {
  id: number;
  name: string;
  roleId: number;
  roleName: string;
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
    roleName: '',
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
    private userService: UserService,
    private authStorageService: AuthStorageService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = +params['id'];
      this.getUserDetails(this.userId);
      this.loadRoles();
    });
  }
  getUserDetails(userId: number): void {
    this.userService.getUserById(userId).subscribe(
      (response: any) => {
        if (response.isSuccess) {
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
          this.userService.getRoleById(this.user.roleId).subscribe(
            (roleResponse: any) => {
              if (roleResponse.isSuccess) {
                this.user.roleName = roleResponse.result;
              } else {
              }
            },
            (error) => {}
          );
        } else {
          this.user = {} as UserData;
        }
      },
      (error) => {
        this.user = {} as UserData;
      }
    );
  }

  loadRoles(): void {
    this.userService.getRoles().subscribe(
      (response: any) => {
        if (response.isSuccess) {
          this.roles = response.result;
        } else {
          this.roles = [];
        }
      },
      (error) => {
        this.roles = [];
      }
    );
  }

  onSubmit(): void {
    this.user.password = '';
    // Ensure the user object is properly populated with updated data
    this.userService.updateUserById(this.user).subscribe(
      (response) => {
        // Optionally, you can redirect to another page or perform other actions upon successful update
        this.router.navigate(['list-user']);
      },
      (error) => {}
    );
  }

  BacktoView(entityName: string) {
    this.router.navigate([`entity/${entityName}`]);
    localStorage.removeItem('logDetailsData');
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
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: string | undefined) => {
      if (result) {
        // Handle the selected database
      } else {
        // Handle modal close event
      }
    });
  }
  
  listuser(): void {
    this.router.navigate(['list-user']);
  }
}
