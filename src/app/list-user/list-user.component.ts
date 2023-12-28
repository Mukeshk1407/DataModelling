import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserTableDTO } from '../models/user-table.dto';
import { UserInfoService } from '../services/user-info.service';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent {
  entityName: string = ''; 
  users: UserTableDTO[] = [];
  totalUserCount: number = 0;
  activeUserCount: number = 0;
  inactiveUserCount: number = 0;
  selectedUserId: number | null = null; // Add this line
  roles: any[] = []; // Add this line
  constructor(private router: Router, private UserInfoService : UserInfoService){
  }

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.UserInfoService.getUsers().subscribe(
      (response: any) => {
        console.log('Response from getUsers:', response);
  
        if (response.isSuccess && Array.isArray(response.result)) {
          this.users = response.result;
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
    this.activeUserCount = this.users.filter(user => user.status === true).length;
    this.inactiveUserCount = this.totalUserCount - this.activeUserCount;
  }
  BacktoView(entityName : string) {
    this.router.navigate([`entity/${entityName}`]);
    localStorage.removeItem('logDetailsData');
    // Dispatch the logout action
    // this.store.dispatch(authActions.logout());
  }
  selectUser(userId: number) {
    this.selectedUserId = userId;
  }
}
