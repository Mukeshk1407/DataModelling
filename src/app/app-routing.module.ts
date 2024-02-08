import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { EntityListComponent } from './entity-list/entity-list.component';
import { EntityDetailsComponent } from './entity-details/entity-details.component';
import { LogDetailsComponent } from './log-details/log-details.component';
import { CreateEntityComponent } from './create-entity/create-entity.component';
import { EditEntityComponent } from './edit-entity/edit-entity.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { ListUserComponent } from './list-user/list-user.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';


const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register',component: CreateUserComponent},
  { path: 'entitylist', component: EntityListComponent },
  { path: 'entity/:entityName', component: EntityDetailsComponent },
  {path:'log_details/:logId',component:LogDetailsComponent},
  {path:'createentity',component:CreateEntityComponent},
  {path:'Edit-Entity/:entityName',component:EditEntityComponent},
  {path:'list-user',component:ListUserComponent},
  { path: 'view-user/:id', component: ViewUserComponent },
  {path:'edit-user/:id',component:EditUserComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
