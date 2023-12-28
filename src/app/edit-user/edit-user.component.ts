import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserTableDTO } from '../models/user-table.dto';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent {
  entityName: string = ''; 
  userId!: number;
  user: UserTableDTO = {} as UserTableDTO;
  roles: any[] = []; // Add this property to store roles
  constructor(private router: Router){
    
  }

  BacktoView(entityName : string) {
    this.router.navigate([`entity/${entityName}`]);
    localStorage.removeItem('logDetailsData');
    // Dispatch the logout action
    // this.store.dispatch(authActions.logout());
  }
}
