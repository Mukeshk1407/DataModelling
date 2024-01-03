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
  dob: string; // Update this based on your actual data type
  roleId: number; // Include roleId property // Update this based on your actual data type
  status: boolean; // Update this based on your actual data type
  roleName: string; // Add this line
}
@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {
  entityName: string = '';
  userId!: number;
  user: User = {} as User; 

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userInfoService: UserInfoService,private authStorageService: AuthStorageService,private dialog:MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = +params['id'];
      this.getUserDetails(this.userId);
    });
  }

  getUserDetails(userId: number): void {
    this.userInfoService.getUserById(userId).subscribe(
      (response: any) => {
        if (response.isSuccess) {
          console.log('Received user details:', response.result);

          const result = response.result;

          this.user = {
            name: result.name,
            email: result.email,
            phonenumber: result.phonenumber,
            gender: result.gender,
            dob: result.dob,
            roleId: result.roleId,
            status: result.status,
            roleName: '' // Initialize roleName, it will be filled later
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
          this.user = {} as User;
        }
      },
      (error) => {
        console.error('Error fetching user details:', error);
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
    console.log('Role changed:', event.target.value);
  }
  editUser(): void {
    console.log("clicked")
    this.router.navigate([`edit-user/${this.userId}`]);
  }
  listuser(): void{
    console.log("clicked")
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
