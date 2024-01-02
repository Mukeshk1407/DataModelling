import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, of } from 'rxjs';
import { selectLoggedIn ,selectRole} from '../state/auth.selectors';
import * as authActions from '../state/auth.actions';
import { ConnectdatabaseComponent } from '../connectdatabase/connectdatabase.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthStorageService } from '../services/authstorage.service';



@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  isPopupVisible = false;
  //loggedIn$ = false;
   loggedIn$ !: Observable<boolean>;
   role$!: Observable<string | null>;

  constructor(private router: Router, private store: Store, private dialog: MatDialog,private authStorageService: AuthStorageService) {
    var storedAuthInfo = this.authStorageService.getAuthInfo();
    if(storedAuthInfo != undefined  && storedAuthInfo.loggedIn != undefined) {
      this.loggedIn$ = of(storedAuthInfo?.loggedIn);
    }
    this.role$ = this.store.select(selectRole);
    // this.loggedIn$ = this.store.select(selectLoggedIn);
  }

  ngOnInit(): void {
    // this.loggedIn$ = this.store.select(selectLoggedIn);
    // this.role$ = this.store.select(selectRole);
  
    this.loggedIn$!.subscribe(loggedIn => console.log('LoggedIn:', loggedIn));
    this.role$!.subscribe(role => console.log('Role:', role));
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']); // Update 'login' with the actual route path to your login component
  }

  logout() {
    
    this.authStorageService.clearAuthInfo();
    this.router.navigate(['']);
    window.location.reload();
    // Dispatch the logout action
    // this.store.dispatch(authActions.logout());
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

    navigateToRegister(): void {
      this.router.navigate(['/register']); // Update 'login' with the actual route path to your login component
    }
}

