import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APIService } from '../apiservice';
import { MessageService } from 'primeng/api';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
  mobilenumber = null;

  selectedRoom = '';

  hurtRateData = [];
  hurtRateChart = null;
  countGraph = 0;

  oxLvlData = [];
  oxLvlChart = null;

  constructor(private route: ActivatedRoute, private apiService: APIService, private httpService: HttpClient,
    private messageService: MessageService, private socketService: SocketService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(
      (params) => {
        this.mobilenumber = params.number;
        this.httpService.get(this.apiService.checkMobileNumberExist + '?mobile=' + this.mobilenumber, { responseType: 'text' }).subscribe(
          (resp) => {
            if (resp == "0") {
              this.messageService.add({ severity: 'error', summary: 'No longer exist', detail: 'Mobile number notfound' });
            } else {
              this.selectedRoom = resp;
              this.socketService.createSocket();
              this.hurtRateData = [];
              for (let index = 0; index < 10; index++) {
                this.hurtRateData.push({
                  x: 0,
                  y: 0
                });
              }
              this.generateHurtRate(0);

              for (let index = 0; index < 10; index++) {
                this.oxLvlData.push({
                  x: 0,
                  y: 0
                });
              }
              this.generateoxLvl(0);

              this.socketService.getMessages().subscribe(
                (result) => {
                  if (result.roomId == this.selectedRoom) {
                    this.countGraph++;
                    this.generateHurtRate(result.hurtRate);
                    this.generateoxLvl(result.oxLvl);
                  }
                }
              );
            }
          }
        );
      }
    );
  }

  generateHurtRate(hurtRateSocketData) {
    if (this.hurtRateChart == null) {
      const options = {
        chart: {
          type: 'line',
          height: 350,
          animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
              speed: 1000
            }
          },
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        title: {
          text: 'BPM',
          align: 'left'
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          show: false
        },
        series: [{
          name: 'BPM',
          data: this.hurtRateData
        }],
        yaxis: {
          max: 200,
          min: 0,
          tickAmount: 10,
          labels: {
            formatter: function (value) {
              return parseInt(value)
            }
          }
        }
      };
      this.hurtRateChart = new ApexCharts(document.getElementById("hurtRate"), options);
      this.hurtRateChart.render();
    } else {
      this.hurtRateData.shift();

      this.hurtRateData.push({
        x: this.countGraph,
        y: hurtRateSocketData
      });

      this.hurtRateChart.updateSeries([{
        data: this.hurtRateData
      }]);
    }
  }

  generateoxLvl(oxLvlSocketData) {
    if (this.oxLvlChart == null) {
      const options = {
        chart: {
          type: 'line',
          height: 350,
          animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
              speed: 1000
            }
          },
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        title: {
          text: 'Oxygen level',
          align: 'left'
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          show: false
        },
        series: [{
          name: 'Oxygen level',
          data: this.oxLvlData
        }],
        yaxis: {
          max: 100,
          min: 0,
          tickAmount: 10,
          labels: {
            formatter: function (value) {
              return parseInt(value)
            }
          }
        }
      };
      this.oxLvlChart = new ApexCharts(document.getElementById("oxLvl"), options);
      this.oxLvlChart.render();
    } else {
      this.oxLvlData.shift();

      this.oxLvlData.push({
        x: this.countGraph,
        y: oxLvlSocketData
      });

      this.oxLvlChart.updateSeries([{
        data: this.oxLvlData
      }]);
    }
  }

  ngOnDestroy() {
    this.socketService.closeSocket();
  }
}
