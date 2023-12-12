import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectLoggedIn } from '../state/auth.selectors';
import * as authActions from '../state/auth.actions';
import { ConnectdatabaseComponent } from '../connectdatabase/connectdatabase.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  isPopupVisible = false;
  loggedIn$ !: Observable<boolean>;

  constructor(private router: Router, private store: Store, private dialog: MatDialog) {
    this.loggedIn$ = this.store.select(selectLoggedIn);
  }

  ngOnInit(): void {
    // ... (existing initialization logic)
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']); // Update 'login' with the actual route path to your login component
  }

  logout() {
    // Dispatch the logout action
    this.store.dispatch(authActions.logout());
  }

  dbPopup() {
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

