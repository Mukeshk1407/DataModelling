import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ValidationErrors } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Store } from '@ngrx/store';
import * as authActions from '../state/auth.actions';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  selectLoggedIn,
  selectRole,
  selectToken,
  selectUsername,
} from '../state/auth.selectors';
import { JWTTokenService } from '../services/jwttocken.service';
import { ToastrService } from '../services/ToastrService';
import { Router } from '@angular/router';
import { AuthStorageService } from '../services/authstorage.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup = {} as FormGroup;
  token$: Observable<string | null> | undefined;
  username$: Observable<string | null> | undefined;
  role$: Observable<string | null> | undefined;
  loggedIn$: Observable<boolean> | undefined;

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private store: Store,
    private jwtTockenService: JWTTokenService,
    private toastrService: ToastrService,
    private router: Router,
    private authStorageService: AuthStorageService,
    private dialog: MatDialog
  ) {
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

    this.token$!.pipe(takeUntil(this.ngUnsubscribe)).subscribe((token) => {});

    this.username$!.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      (username) => {}
    );

    this.role$!.pipe(takeUntil(this.ngUnsubscribe)).subscribe((role) => {});

    this.loggedIn$!.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      (loggedIn) => {}
    );
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
      this.toastrService.showError("Invalid Credentials");
      return;
    }
    this.userService
      .login(this.f['username'].value, this.f['password'].value)
      .subscribe(
        (response) => {
          if (response.isSuccess) {
            const token = response.result;
            this.jwtTockenService.getUser(token.toString());
            const loggedIn = true;
            const tokenvalue = token.toString();
            const username = this.jwtTockenService.getUser(token.toString());
            const email = this.jwtTockenService.getRole(token.toString());
            const role = this.jwtTockenService.getEmailId(token.toString());
            this.authStorageService.setAuthInfo(
              loggedIn,
              tokenvalue,
              username,
              email,
              role
            );
            this.toastrService.showSuccess('LogIn successfully');
            this.router.navigate(['']);
          } else {
            this.store.dispatch(
              authActions.loginFailure({ error: 'Authentication failed' })
            );
            this.toastrService.showError(response.result);
          }
        },
        (error) => {
          this.toastrService.showError(error.error.errorMessage[0]);
        });
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
    return control
      ? control.invalid && (control.dirty || control.touched)
      : false;
  }

  logout() {
    const loggedIn = true;
    const tokenvalue = '';
    const username = '';
    const email = '';
    const role = '';
    this.authStorageService.setAuthInfo(
      loggedIn,
      tokenvalue,
      username,
      email,
      role
    );
  }
}
