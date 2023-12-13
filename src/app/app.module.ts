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
    CreateEntityComponent
   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
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
