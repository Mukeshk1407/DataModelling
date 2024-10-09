import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ScreenmappingService } from '../services/screenmapping.service';
import { Role } from '../models/Role';
import { Screen } from '../models/Screen';
import { Screenmapping } from '../models/screenmappingDTO';

@Component({
  selector: 'app-screen-mapping',
  templateUrl: './screen-mapping.component.html',
  styleUrls: ['./screen-mapping.component.css'],
})
export class ScreenMappingComponent implements OnInit {
  roles: Role[] = [];
  screens: Screen[] = [];
  roleScreensMapping: Screenmapping[] = [];

  constructor(
    private dialog: MatDialog,
    private rolescreenService: ScreenmappingService
  ) {}

  ngOnInit(): void {
    this.getRoles();
    this.getScreens();
    this.getRoleScreens();
  }

  getRoles() {
    this.rolescreenService.getRoles().subscribe(
      (data: any) => {
        console.log('Roles fetched:', data);

        this.roles = data.result.result;
      },
      (error) => {
        console.error('Error fetching roles:', error);
      }
    );
  }

  getScreens() {
    this.rolescreenService.getScreens().subscribe(
      (data: any) => {
        console.log('Screens fetched:', data);

        this.screens = data.result.result;
      },
      (error) => {
        console.error('Error fetching screens:', error);
      }
    );
  }

  getRoleScreens() {
    this.rolescreenService.getRoleScreens().subscribe(
      (data: any) => {
        console.log('Role-Screen Mappings fetched:', data);
        this.roleScreensMapping = data.result;
      },
      (error) => {
        console.error('Error fetching role-screen mappings:', error);
      }
    );
  }

  isScreenMapped(roleId: number, screenId: number): boolean {
    return this.roleScreensMapping.some(
      (mapping) => mapping.role.id === roleId && mapping.screen.id === screenId
    );
  }

  closePopup(): void {
    this.dialog.closeAll();
  }
}
