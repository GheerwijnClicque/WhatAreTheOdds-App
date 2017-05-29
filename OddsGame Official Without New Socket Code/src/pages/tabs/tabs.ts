import { Component } from '@angular/core';

import { HighscoresPage } from '../highscores/highscores';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { FriendsPage } from '../friends/friends';

import { DatabaseProvider } from '../../providers/database-provider';
import { SocketProvider } from '../../providers/socket-provider';

import { Storage } from '@ionic/storage';

import { server } from '../../providers/server-info';
import * as io from 'socket.io-client';
import { ToastController } from 'ionic-angular';

const URL = server.URL;

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  private serverInfo: any;
  private socket: any;
  private user_id: any = 0;
  private newChallengesCount: number = 1;

  tab1Root = HomePage;
  tab2Root = FriendsPage;
  tab3Root = HighscoresPage;
  tab4Root = ContactPage;


  constructor(private db: DatabaseProvider, private storage: Storage, private toastCtrl: ToastController, private socketProvider: SocketProvider) {
    /*storage.get('score').then((value) => {


    }, (error) => {
      alert(error);
    }); */

    // SOCKETS HERE!!!!!! -> achievements and challenged! + notifications (badge on challenges tab!)
 
    this.storage.get('challengeCount').then((value) => {
        this.newChallengesCount = value;
      });

      socketProvider.getSocket().then((socket: any) => {
        console.log('tab');
        console.log(socket);
        socket.on('challenge-add', (challenge) => {
           alert('added');
          console.log('added challenge');


          this.storage.get('challengeCount').then((value) => {
            this.newChallengesCount = value;
          });
          this.newChallengesCount = this.newChallengesCount + 1;
          this.storage.set('challengeCount', this.newChallengesCount);
        });
    }).catch((error) => {
      console.log(error);
    });

  }

  ionViewWillEnter() {
     this.storage.get('user').then((value) => {
      this.user_id = JSON.parse(value).id; // Move this to constructor!!

  //    this.socket = io('http://' + URL + ':3000/', {query: 'data=' + this.user_id});
  
  /*    this.socket.on('connect', () => {
        console.log('socket');
        console.log(this);
      });

      this.socket.on('challenge-add', (challenge) => {
          alert('added');
          console.log('added challenge');
          this.storage.get('challengeCount').then((value) => {
            this.newChallengesCount = value;
          });
          this.newChallengesCount = this.newChallengesCount + 1;
          this.storage.set('challengeCount', this.newChallengesCount);
      });

      this.socket.on('achievements-update', (achievements) => {
        if(achievements) {
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
      }); */

    });
  }

  ionViewDidEnter() {

  }

  getNewChallengesCount() {
    return (this.newChallengesCount > 0) ? this.newChallengesCount : '';
  }

}
