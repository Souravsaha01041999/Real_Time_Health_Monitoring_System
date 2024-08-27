import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APIService } from '../apiservice';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { LoginService } from '../isLogin';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginId: string = '';
  password: string = '';

  constructor(private httpService: HttpClient, private urlService: APIService,
    private messageService: MessageService, private routingService: Router,
    private isLogin: LoginService) { }

  onClickLogin() {
    this.httpService.post(this.urlService.adminLogin, {
      loginId: this.loginId,
      password: this.password
    }, { responseType: 'text' }).subscribe((resp) => {
      if (resp == '0') {
        this.messageService.add({ severity: 'error', summary: 'Incorrect', detail: 'Incorrect credential' });
      } else {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Loged in' });
        sessionStorage.setItem('uid', this.loginId);
        this.isLogin.isLogin.next(true);
        this.routingService.navigate(['/dashboard']);
      }
    });
  }
}
