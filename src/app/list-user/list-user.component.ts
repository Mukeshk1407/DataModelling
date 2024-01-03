import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserTableDTO } from '../models/user-table.dto';
import { UserInfoService } from '../services/user-info.service';
import { AuthStorageService } from '../services/authstorage.service';
import { ConnectdatabaseComponent } from '../connectdatabase/connectdatabase.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css'],
})
export class ListUserComponent {
  entityName: string = '';
  users: UserTableDTO[] = [];
  totalUserCount: number = 0;
  activeUserCount: number = 0;
  inactiveUserCount: number = 0;
  selectedUserId: number | null = null; // Add this line
  roles: any[] = []; // Add this line
  constructor(
    private router: Router,
    private UserInfoService: UserInfoService,
    private authStorageService: AuthStorageService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.UserInfoService.getUsers().subscribe(
      (response: any) => {
        console.log('Response from getUsers:', response);
  
        if (response.isSuccess && Array.isArray(response.result)) {
          this.users = response.result;
  
          // Fetch role names for each user
          this.users.forEach(user => {
            this.UserInfoService.getRoleById(user.roleId).subscribe(
              (roleResponse: any) => {
                if (roleResponse.isSuccess) {
                  user.roleName = roleResponse.result;
                } else {
                  console.error('Error fetching role:', roleResponse.error);
                }
              },
              (error) => {
                console.error('Error fetching role:', error);
              }
            );
          });
  
          this.calculateUserCounts();
        } else {
          console.error('Invalid data format. Expected an array.');
        }
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }
  

  calculateUserCounts() {
    this.totalUserCount = this.users.length;
    this.activeUserCount = this.users.filter(
      (user) => user.status === true
    ).length;
    this.inactiveUserCount = this.totalUserCount - this.activeUserCount;
  }
  BacktoView() {
    this.router.navigate([`/register`]);
    // Dispatch the logout action
    // this.store.dispatch(authActions.logout());
  }
  selectUser(userId: number) {
    this.selectedUserId = userId;
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
        console.log('Selected Database:', result);
      } else {
        // Handle modal close event
        console.log('Modal closed');
      }
    });
  }
}
