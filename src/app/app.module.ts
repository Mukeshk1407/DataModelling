import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { authReducer } from './state/auth.reducer';
import { HttpClientModule } from '@angular/common/http';
import { JWTTokenService } from './services/jwttocken.service';
import { ConnectdatabaseComponent } from './connectdatabase/connectdatabase.component';
import { MatDialogModule } from '@angular/material/dialog';
import { EntityListComponent } from './entity-list/entity-list.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EntityDetailsComponent } from './entity-details/entity-details.component';
import { LogDetailsComponent } from './log-details/log-details.component';
import { EditEntityComponent } from './edit-entity/edit-entity.component';
import { CreateEntityComponent } from './create-entity/create-entity.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateUserComponent } from './create-user/create-user.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ListUserComponent } from './list-user/list-user.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ErrorDetailsPopupComponent } from './error-details-popup/error-details-popup.component';
import { RoleManagementComponent } from './role-management/role-management.component';
import { ScreenManagementComponent } from './screen-management/screen-management.component';


@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LoginComponent,
    ConnectdatabaseComponent,
    EntityListComponent,
    EntityDetailsComponent,
    LogDetailsComponent,
    EditEntityComponent,
    CreateEntityComponent,
    CreateUserComponent,
    ListUserComponent,
    ViewUserComponent,
    EditUserComponent,
    ErrorDetailsPopupComponent,
    RoleManagementComponent,
    ScreenManagementComponent
   ],
  imports: [
    BrowserModule,
    MatDatepickerModule,
    MatNativeDateModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    EffectsModule.forRoot([]),
    StoreModule.forRoot({ auth: authReducer }),
    HttpClientModule,
    MatDialogModule,
    MatTooltipModule,
    ToastrModule.forRoot({
      timeOut: 5000, 
      positionClass: 'toast-top-right', 
      preventDuplicates: true,
    })
  ],
  providers: [JWTTokenService],
  bootstrap: [AppComponent]
})
export class AppModule { }
