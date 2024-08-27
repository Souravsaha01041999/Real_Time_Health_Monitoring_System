import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { APIService } from '../apiservice';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dashboardDetails: any = null;

  isShowScreen = false;
  pseVisible = false;
  pseName = '';
  pseMobile = '';
  assignDoctor = '';
  room = '';

  doctorVisible = false;
  doctorName = '';
  doctorEmail = '';
  doctorPassword = '';

  constructor(private httpService: HttpClient, private apiService: APIService,
    private messageService: MessageService) { }

  ngOnInit() {
    this.initData();
  }

  initData() {
    this.httpService.get(this.apiService.dashboard).subscribe(
      (resp) => {
        this.dashboardDetails = resp;
        this.isShowScreen = true;
      }
    );
  }

  onSavePse() {
    this.httpService.post(this.apiService.savePse, {
      mobile: this.pseMobile,
      name: this.pseName,
      doctor: this.assignDoctor,
      room: this.room
    }, { responseType: 'text' }).subscribe(
      (resp) => {
        this.messageService.add({ severity: 'success', summary: 'Done', detail: 'Saved' });
        this.isShowScreen = false;
        this.pseVisible = false;
        this.pseName = '';
        this.pseMobile = '';
        this.assignDoctor = '';
        this.room = '';
        this.initData();
      },
      (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please check internet' });
      }
    );
  }

  onSaveDoctor() {
    this.httpService.post(this.apiService.saveDoctor, {
      email: this.doctorEmail,
      name: this.doctorName,
      password: this.doctorPassword
    }, { responseType: 'text' }).subscribe(
      (resp) => {
        this.doctorVisible = false;
        this.doctorName = '';
        this.doctorEmail = '';
        this.doctorPassword = '';
        this.initData();
      },
      (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please check internet' });
      }
    );
  }
}
