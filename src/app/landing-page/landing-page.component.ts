import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { selectRole } from '../state/auth.selectors';
import { ConnectdatabaseComponent } from '../connectdatabase/connectdatabase.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthStorageService } from '../services/authstorage.service';
import { UserService } from '../services/user.service';
import { RoleManagementComponent } from '../role-management/role-management.component';
import { ScreenManagementComponent } from '../screen-management/screen-management.component';
import { ScreenMappingComponent } from '../screen-mapping/screen-mapping.component';
import { PortCommunicationComponent } from '../port-communication/port-communication.component';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnInit {
  isPopupVisible = false;
  loggedIn$!: Observable<boolean>;
  role$!: Observable<string | null>;

  constructor(
    private router: Router,
    private store: Store,
    private dialog: MatDialog,
    private authStorageService: AuthStorageService,
    private userService: UserService
  ) {
    var storedAuthInfo = this.authStorageService.getAuthInfo();
    if (storedAuthInfo != undefined && storedAuthInfo.loggedIn != undefined) {
      this.loggedIn$ = of(storedAuthInfo?.loggedIn);
      this.role$ = this.store.select(selectRole);
    }
    this.role$ = this.store.select(selectRole);
  }

  ngOnInit(): void {
    this.loggedIn$!.subscribe((loggedIn) => {
      if (loggedIn) {
        const userRole = this.userService.getUserRole();
      }
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']); // Update 'login' with the actual route path to your login component
  }
  isAdminRole(): boolean {
    const userRole = this.userService.getUserRole()?.toLowerCase(); // Convert to lowercase for case-insensitive comparison

    // List of possible admin role values
    const adminRoles = [
      'admin',
      'administrator',
      'superadmin',
      'createadmin',
      'Admin',
    ];

    return userRole !== undefined && adminRoles.includes(userRole);
  }

  logout() {
    this.authStorageService.clearAuthInfo();
    this.router.navigate(['']);
    window.location.reload();
  }

  dbPopup() {
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

  RolePopup() {
    const dialogRef = this.dialog.open(RoleManagementComponent, {
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

  navigateToRegister(): void {
    this.router.navigate(['/list-user']); // Update 'login' with the actual route path to your login component
  }

  ScreenPopup() {
    const dialogRef = this.dialog.open(ScreenManagementComponent, {
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
  ScreenMappingPopup() {
    const dialogRef = this.dialog.open(ScreenMappingComponent, {
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
  portCommunicationPopup() {
    const dialogRef = this.dialog.open(PortCommunicationComponent, {
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
