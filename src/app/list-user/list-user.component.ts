import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserTableDTO } from '../models/user-table.dto';
import { AuthStorageService } from '../services/authstorage.service';
import { ConnectdatabaseComponent } from '../connectdatabase/connectdatabase.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../services/user.service';

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
  selectedUserId: number | null = null;
  roles: any[] = [];
  constructor(
    private router: Router,
    private userService: UserService,
    private authStorageService: AuthStorageService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.userService.getUsers().subscribe(
      (response: any) => {
        if (response.isSuccess && Array.isArray(response.result)) {
          this.users = response.result;
          this.users.forEach((user) => {
            this.userService.getRoleById(user.roleId).subscribe(
              (roleResponse: any) => {
                if (roleResponse.isSuccess) {
                  user.roleName = roleResponse.result.roleName;
                } else {
                }
              },
              (error) => {}
            );
          });

          this.calculateUserCounts();
        } else {
        }
      },
      (error) => {}
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
    this.router.navigate(['']);
  }
  Create() {
    this.router.navigate([`/register`]);
  }
  selectUser(userId: number) {
    this.selectedUserId = userId;
  }
  logout() {
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
