import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { EntityListComponent } from './entity-list/entity-list.component';
import { EntityDetailsComponent } from './entity-details/entity-details.component';
import { LogDetailsComponent } from './log-details/log-details.component';
import { CreateEntityComponent } from './create-entity/create-entity.component';
import { EditEntityComponent } from './edit-entity/edit-entity.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'entitylist', component: EntityListComponent },
  { path: 'entity/:entityName', component: EntityDetailsComponent },
  {path:'Log-details',component:LogDetailsComponent},
  {path:'createentity',component:CreateEntityComponent},
  {path:'Edit-Entity/:entityName',component:EditEntityComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
