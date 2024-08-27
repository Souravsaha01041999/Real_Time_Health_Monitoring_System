import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class APIService {
    constructor() { }

    public HOST = 'https://aquatic-cuboid-tumbleweed.glitch.me';
    // private HOST = 'http://localhost:2024';
    public adminLogin = this.HOST + '/loginadmin';
    public dashboard = this.HOST + '/dashboardApi';
    public getAllRooms = this.HOST + '/getrooms';
    public checkMobileNumberExist = this.HOST + '/checkmobile';
    public savePse = this.HOST + '/add_pes';
    public saveDoctor = this.HOST + '/add_doctor';
}
