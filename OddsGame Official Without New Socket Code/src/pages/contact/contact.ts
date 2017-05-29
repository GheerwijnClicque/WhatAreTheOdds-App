import { Component, ViewChild } from '@angular/core';
import { NavController, ModalController, ActionSheetController, PopoverController } from 'ionic-angular';
import { NgSwitch, NgSwitchCase } from '@angular/common'
import { Storage } from '@ionic/storage';

import { Facebook } from '@ionic-native/facebook';

import { Login } from '../login/login';
import { Chart } from 'chart.js';
import { DatabaseProvider } from '../../providers/database-provider';
import { PopoverPage } from '../popover/popover';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  @ViewChild('pieChartCanvas') pieChartCanvas;
  user_name: any;
  user_id: any;
  picture: any;
  pieChart: any;
  statistics: any = [];
  achievements: any = [];
  selectedSegment: string = "statistics";

  loading: boolean = true;


  constructor(public navCtrl: NavController, private storage: Storage, private fb: Facebook, private db: DatabaseProvider, private modalCtrl: ModalController, 
              private actionSheetCtrl: ActionSheetController, private popoverCtrl: PopoverController) {
      this.fb.api('me/picture?redirect=false', ['public_profile']).then(function(response) {
        var url = response.data.url;
        this.picture = response.data.url;
      }.bind(this), function(error) {
        console.log(error);
      });
  }

  ionViewWillEnter() {
    this.storage.get('user').then(function(value) {
      this.user_name = JSON.parse(value).name;
      this.user_id = JSON.parse(value).id;

    this.selectSegment();

    }.bind(this));
  }

  renderChart() {
    var options = {
      type: 'doughnut',
      data: {
        labels: ["Completed", "Failed", "Declined"],
        datasets: [{
          label: 'Statistics',
          data: [this.statistics['completed_challenges'], this.statistics['failed_challenges'], this.statistics['declined_challenges']],
          backgroundColor: [
            '#79f2a9',
            '#F25F5C', //E5F9E0
            '#FCF6B1',
          ],
          borderColor: [
            '#79f2a9',
            '#F25F5C', //E5F9E0
            '#FCF6B1',
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        legend: {
          display: false,
          position: 'bottom',
          labels: {fontColor:"white", fontSize: 11}
        },
      }
    };

    let that = this;
    Chart.pluginService.register({
      beforeDraw: function(chart) {
        var width = chart.chart.width,
            height = chart.chart.height,
            ctx = chart.chart.ctx;

        ctx.restore();
        var fontSize = (height / 195).toFixed(2);
        ctx.font = fontSize + "em sans-serif";
        ctx.textBaseline = "middle";
        ctx.fillStyle = '#fff';

        let score = that.statistics['score'];
        console.log(score);
        var text = "score: " + score,
            textX = Math.round((width - ctx.measureText(text).width) / 2),
            textY = (height / 2);

        ctx.fillText(text, textX, textY);
        ctx.save();
      }
    });

    this.pieChart = new Chart(this.pieChartCanvas.nativeElement, options);
  }

  logout() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Are you sure you want to log out?',
      buttons: [
        {
          text: 'Log Out',
          role: 'destructive',
          handler: () => {
            this.fb.logout().then(function(response) {
              this.storage.remove('user');
              //this.navCtrl.setRoot(Login);
              let loginModal = this.modalCtrl.create(Login);
              loginModal.present();
            }.bind(this), function(error) {
              alert(error);
            })
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();

  }


  request() {
    this.fb.api('me/picture?redirect=false', ['public_profile']).then(function(response) {
      var url = response.data.url;
      this.picture = response.data.url;
    }.bind(this), function(error) {
      alert(error);
    });
  }

  selectedTabChanged($event): void {
    this.selectSegment();
  }

  selectSegment() {
    switch(this.selectedSegment) {
      case 'achievements':
          this.loading = true;
          this.getAchievements();
          break;
      case 'statistics':
        this.loading = true;
            this.db.getStatistics(this.user_id).map(res => res.json()).subscribe(response => {
          //  this.statistics['completed_challenges'] = response['completed_challenges'];
          //  this.statistics['failed_challenges'] = response['failed_challenges'];
          //  this.statistics['declined_challenges'] = response['declined_challenges'];
            this.statistics = response;
            console.log(this.statistics);
            this.renderChart();
            this.loading = false;
          },
          error => {
            console.log(error);
          },
          () => console.log("Finished"));

          break;
      case 'settings':
          break;
    }
  }

  getAchievements() {
    this.db.getAchievements(this.user_id).map(res => res.json()).subscribe(response => {
        this.achievements = response;
        console.log(response);
        this.loading = false;
      },
      error => {
        console.log(error);
      },
      () => console.log("Finished"));
  }

  achievementInfo(myEvent, achievement) {
     let popover = this.popoverCtrl.create(PopoverPage, {achievement: achievement});
      popover.present({
        ev: myEvent
      });
  }

}
