import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserInfoService } from '../services/user-info.service';
import { AuthStorageService } from '../services/authstorage.service';
import { ConnectdatabaseComponent } from '../connectdatabase/connectdatabase.component';
import { MatDialog } from '@angular/material/dialog';

interface User {
  name: string;
  email: string;
  phonenumber: string;
  gender: string;
  dob: string;
  roleId: number;
  status: boolean;
  roleName: string;
}
@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css'],
})
export class ViewUserComponent implements OnInit {
  entityName: string = '';
  userId!: number;
  user: User = {} as User;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userInfoService: UserInfoService,
    private authStorageService: AuthStorageService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = +params['id'];
      this.getUserDetails(this.userId);
    });
  }

  getUserDetails(userId: number): void {
    this.userInfoService.getUserById(userId).subscribe(
      (response: any) => {
        if (response.isSuccess) {
          const result = response.result;

          this.user = {
            name: result.name,
            email: result.email,
            phonenumber: result.phonenumber,
            gender: result.gender,
            dob: result.dob,
            roleId: result.roleId,
            status: result.status,
            roleName: '',
          };

          // Fetch the role name for the user
          this.userInfoService.getRoleById(this.user.roleId).subscribe(
            (roleResponse: any) => {
              if (roleResponse.isSuccess) {
                this.user.roleName = roleResponse.result;
              } else {
              }
            },
            (error) => {}
          );
        } else {
          this.user = {} as User;
        }
      },
      (error) => {
        this.user = {} as User;
      }
    );
  }

  BacktoView(entityName: string): void {
    this.router.navigate([`entity/${entityName}`]);
    localStorage.removeItem('logDetailsData');
  }
  onRoleChange(event: any): void {
    // Handle the change if needed
  }
  editUser(): void {
    this.router.navigate([`edit-user/${this.userId}`]);
  }
  listuser(): void {
    this.router.navigate(['list-user']);
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
}
