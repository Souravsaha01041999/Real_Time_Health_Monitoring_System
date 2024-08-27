import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { MessageService } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { HttpClientModule } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthService } from './AuthService';
import { CardModule } from 'primeng/card';
import { MonitorComponent } from './monitor/monitor.component';
import { UserComponent } from './user/user.component';
import { DialogModule } from 'primeng/dialog';

const myRouts: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthService] },
  { path: 'monitor', component: MonitorComponent, canActivate: [AuthService] },
  { path: 'user', component: UserComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    MonitorComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    PanelModule,
    HttpClientModule,
    CardModule,
    InputTextModule,
    ToastModule,
    DialogModule,
    ButtonModule,
    RouterModule.forRoot(myRouts)
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
