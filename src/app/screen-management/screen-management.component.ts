import { Component, OnInit } from '@angular/core';
import { ScreenService } from '../services/screen.service';
import { Screen } from '../models/Screen';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-screen-management',
  templateUrl: './screen-management.component.html',
  styleUrls: ['./screen-management.component.css']
})
export class ScreenManagementComponent implements OnInit {
  screens: Screen[] = [];
  rolesWithScreens: any[] = [];

  constructor(private screenService: ScreenService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.fetchScreens();
  }

  fetchScreens(): void {
    this.screenService.getList().subscribe(
      (screens: Screen[]) => {
        this.screens = screens;
        this.groupScreensByRole();
      },
      error => {
        console.error('Error fetching screens:', error);
      }
    );
  }

  groupScreensByRole(): void {
    const roles: { [key: number]: { roleName: string; screenNames: string[] } } = {};
    this.screens.forEach(screen => {
      if (screen.role && screen.screen) { // Check if both screen.role and screen.screen are defined
        const roleId = screen.role.id;
        if (!roles[roleId]) {
          roles[roleId] = {
            roleName: screen.role.roleName,
            screenNames: []
          };
        }
        roles[roleId].screenNames.push(screen.screen.screenName);
      }
    });
    this.rolesWithScreens = Object.values(roles);
  }
  
  

  closePopup(): void {
    const dialogRef = this.dialog.closeAll();
  }
}
