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



@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LoginComponent,
    ConnectdatabaseComponent,
    EntityListComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    EffectsModule.forRoot([]),
    StoreModule.forRoot({ auth: authReducer }),
    HttpClientModule,
    MatDialogModule,
    MatTooltipModule
  ],
  providers: [JWTTokenService],
  bootstrap: [AppComponent]
})
export class AppModule { }
