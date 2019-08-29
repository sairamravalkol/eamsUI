import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from './meterial.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserComponent } from './user/user.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AccountListComponent } from './accounts/account-list/account-list.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { AccountAddComponent } from './accounts/account-add/account-add.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
   
    UserComponent,
    PageNotFoundComponent,
    AccountListComponent,
    LoginComponent,
    HeaderComponent,
    AccountAddComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    AccountAddComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
