import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserInfoService } from '../services/user-info.service';
interface User {
  name: string;
  email: string;
  phonenumber: string;
  gender: string;
  dob: string; // Update this based on your actual data type
  roleId: number; // Include roleId property // Update this based on your actual data type
  status: boolean; // Update this based on your actual data type
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
    private userInfoService: UserInfoService
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
  
          // Extract user details from the 'result' property
          const result = response.result;
  
          // Assuming gender and role are properties of the result object
          this.user = {
            name: result.name,
            email: result.email,
            phonenumber: result.phonenumber,
            gender: result.gender,
            dob: result.dob,
            roleId: result.roleId,
            status: result.status,
          };
        } else {
          console.error('Error fetching user details:', response);
          // Handle error appropriately, e.g., set a default user object
          this.user = {} as User;
        }
      },
      (error) => {
        console.error('Error fetching user details:', error);
        // Handle error appropriately, e.g., set a default user object
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
}
