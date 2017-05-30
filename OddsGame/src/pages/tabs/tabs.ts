import { Component, ViewChild } from '@angular/core';

import { HighscoresPage } from '../highscores/highscores';
import { ProfilePage } from '../profile/profile';
import { HomePage } from '../home/home';
import { FriendsPage } from '../friends/friends';

import { DatabaseProvider } from '../../providers/database-provider';
import { SocketProvider } from '../../providers/socket-provider';

import { Storage } from '@ionic/storage';

import * as io from 'socket.io-client';
import { NavController, ToastController, ViewController, Tabs } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild('tabs') tabRef: Tabs;

  private serverInfo: any;
  private socket: any;
  private user_id: any = 0;
  private newChallengesCount: number = 1;

  tab1Root = HomePage;
  tab2Root = FriendsPage;
  tab3Root = HighscoresPage;
  tab4Root = ProfilePage;


  constructor(private db: DatabaseProvider, private viewCtrl: ViewController, private navCtrl: NavController, private storage: Storage, 
              private toastCtrl: ToastController, private socketProvider: SocketProvider) {
    this.storage.get('user').then((value) => {
        this.user_id = JSON.parse(value).id;
    });

    // Get socket
    socketProvider.getSocket().then((socket: any) => {
        socket.on('challenge-add', (challenge) => {
          if(this.tabRef && this.tabRef.getSelected().index !== 0 && (challenge.challengee_id === parseInt(this.user_id))) { // No badge needed on homepage
            this.newChallengesCount++;
            let toast = this.toastCtrl.create({
              message: challenge.challenger_name + ' just challenged you!',
              duration: 3000,
              position: 'top',
              cssClass: 'challenge-toast',
            });
            toast.present();
          }
        });

        socket.on('achievements-update', (achievements) => {
        if(achievements.length > 0) {
          var message = 'Achievement "' + achievements[0].name + '" unlocked!';
          if(achievements.length > 1) {
              message += '(' + achievements.length + ' new)';
          }

          let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'top',
            cssClass: 'achievement-toast',
          });
          toast.present();
        }
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  tabSelected(tab) {
    if(tab.index === 0) { // Challenges tab
      this.newChallengesCount = 0;
    }
  }

  getNewChallengesCount() {
    return (this.newChallengesCount > 0) ? this.newChallengesCount : '';
  }
}
