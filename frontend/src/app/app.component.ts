import { Component, OnInit } from '@angular/core';
import { SocketService } from './socket.service';
import { LoginService } from './isLogin';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  isShow = false;
  selectedMenue = 'Dashboard';

  constructor(private isLogin: LoginService, private routerService: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('uid') != null) {
      this.isShow = true;
    }

    this.isLogin.isLogin.subscribe((res) => {
      this.isShow = true;
    });
  }

  onClickMenueItem(clickedItem) {
    this.selectedMenue = clickedItem;
    if (this.selectedMenue == 'Dashboard') {
      this.routerService.navigate(['dashboard']);
    } else if (this.selectedMenue == 'Monitor') {
      this.routerService.navigate(['monitor']);
    }
  }
}
