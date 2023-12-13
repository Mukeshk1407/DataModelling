import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ValidationErrors } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Store } from '@ngrx/store';
import * as authActions from '../state/auth.actions';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { selectLoggedIn, selectRole, selectToken, selectUsername } from '../state/auth.selectors';
import { JWTTokenService } from '../services/jwttocken.service';
import { ToastrService } from '../services/ToastrService';
import { Router } from '@angular/router';
import { AuthStorageService } from '../services/authstorage.service';
import { ConnectdatabaseComponent } from '../connectdatabase/connectdatabase.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup = {} as FormGroup;
  token$: Observable<string | null> | undefined;
  username$: Observable<string | null> | undefined;
  role$: Observable<string | null> | undefined;
  loggedIn$: Observable<boolean> | undefined;

  private ngUnsubscribe = new Subject<void>();

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private store: Store,
    private jwtTockenService: JWTTokenService,
    private toastrService: ToastrService,
    private router: Router,
    private authStorageService: AuthStorageService,
    private dialog : MatDialog) {
    this.token$ = this.store.select(selectToken);
    this.username$ = this.store.select(selectUsername);
    this.role$ = this.store.select(selectRole);
    this.loggedIn$ = this.store.select(selectLoggedIn);
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, this.emailValidator]],
      password: ['', Validators.required],
    });

    this.token$!
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((token) => {
        // Use token as needed, e.g., store it in a class property
        // this.myTokenProperty = token;
      });

    this.username$!
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((username) => {
        // Use username as needed, e.g., store it in a class property
        // this.myUsernameProperty = username;
      });

    this.role$!
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((role) => {
        // Use role as needed, e.g., store it in a class property
        // this.myRoleProperty = role;
      });

    this.loggedIn$!
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((loggedIn) => {
        // Use loggedIn as needed, e.g., store it in a class property
        // this.myLoggedInProperty = loggedIn;
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  get f() {
    return this.loginForm.controls;
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.f['username'].value, this.f['password'].value).subscribe(
      (response) => {
        if (response.isSuccess) {
          const token = response.result;
          this.jwtTockenService.getUser(token.toString())
          // Maintaine in Store
          // this.store.dispatch(
          //   authActions.loginSuccess({
          //     token: token.toString(),
          //     username: this.jwtTockenService.getUser(token.toString()),
          //     role: this.jwtTockenService.getRole(token.toString()),
          //     email: this.jwtTockenService.getEmailId(token.toString()),
          //   })
          // );
          const loggedIn = true;
          const tokenvalue = token.toString();
          const username = this.jwtTockenService.getUser(token.toString());
          const email = this.jwtTockenService.getRole(token.toString());
          const role = this.jwtTockenService.getEmailId(token.toString());
          this.authStorageService.setAuthInfo(loggedIn, tokenvalue, username, email, role);

          this.toastrService.showSuccess('LogIn successfully');
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
        else {
          this.store.dispatch(authActions.loginFailure({ error: 'Authentication failed' }));
          this.toastrService.showError(response.result);
        }
      },
      (error) => {
        this.store.dispatch(authActions.loginFailure({ error: 'Authentication failed' }));
        this.toastrService.showError("Invalid Credentials");
      }
    );
  }

  emailValidator(control: AbstractControl): ValidationErrors | null {
    const pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (control.value && !pattern.test(control.value)) {
      return { email: true };
    }

    return null;
  }

  isInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  logout() {
    const loggedIn = true;
    const tokenvalue = '';
    const username = '';
    const email = '';
    const role = '';
    this.authStorageService.setAuthInfo(loggedIn, tokenvalue, username, email, role);
    // Your logout logic
    // this.store.dispatch(authActions.logout());
  }
}
