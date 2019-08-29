import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

import { UserComponent } from './user/user.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AccountListComponent } from './accounts/account-list/account-list.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path:"", component:HomeComponent,canActivate: [AuthGuard]},
  { path:"home", component:HomeComponent,canActivate: [AuthGuard]},
  { path:"user",component:UserComponent,canActivate: [AuthGuard]},
  { path:"accounts",component:AccountListComponent },
  { path:"login",component:LoginComponent },

 
  { path:"**", component:PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
