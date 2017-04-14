import { Component, NgZone, ViewChild } from '@angular/core';
import { NavController, AlertController, Content } from 'ionic-angular';

import { Facebook } from '@ionic-native/facebook';

import { Storage } from '@ionic/storage';

import { Login } from '../login/login';
import { ContactPage } from '../contact/contact';
import { Challenge } from '../challenge/challenge';
import { ChallengeDetail } from '../challenge-detail/challenge-detail';


import { DatabaseProvider } from '../../providers/database-provider';
import { ChallengesPipe } from '../../app/pipes/challenges';

import * as io from 'socket.io-client';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content: Content;

  public myFriends: any; // friends in app
  public friends: any; // people you might know
  public myChallenges: any = []; // challenges

  private challenge: string = '';
  private socket: any;
  private user_id: any;
  //private zone: any;


  constructor(public navCtrl: NavController, private pipe: ChallengesPipe, public fb: Facebook, public storage: Storage, public db: DatabaseProvider, public alertCtrl: AlertController, private zone: NgZone) {
    //this.zone = new NgZone({enableLongStackTrace: false});




  }

  ionViewWillLeave() {
    this.socket.close();
  }

  ionViewWillEnter() {
    //this.getfriends();
    this.zone.run(() => {
      this.getChallenges();
    });

    this.storage.get('user').then((value) => {
      let userId = JSON.parse(value).id;
      this.user_id = userId;
      this.socket = io('http://192.168.1.147:3000/', {query: 'data=' + userId});

      this.socket.on('challenge-add', (challenge) => {
        this.zone.run(() => {
          this.myChallenges.push(challenge)
          //this.content.scrollToBottom();
          //alert(this.myChallenges.length);
        })
      });

      this.socket.on('challenge-update', (challenge) => {
        this.zone.run(() => {
          this.updateChallenge(challenge);
        })
      });
    });
  }

  ionViewDidEnter() {
   // this.db.addUser('Gheerwijn', '1532159443463111');
   /* this.storage.get('test').then((test) => {
      console.log(test);
    }); */
  }


  doRefresh(refresher) {
    this.zone.run(() => {
      this.getChallenges();
      refresher.complete();
    });
  }

  updateChallenge(challenge) {
      let object = this.myChallenges.find((obj) => {
          return obj.challenge_id === challenge.challenge_id;
      });
      let index = this.myChallenges.indexOf(object);
      this.myChallenges[index] = challenge;
  }


  getfriends() {
    // FB Friends
    /*this.fb.getLoginStatus().then(function(response) {
      if(response.status == 'connected') {
        //alert(JSON.stringify(response));
        //TODO: CHANGE TO JUST /friends!!!!
        this.fb.api("/" + response.authResponse.userID + "/friends", []).then(function onSuccess(response) {
          this.friends = Object.keys(response.data).map((key) => { return response.data[key]; });
          this.friends.push({id: '1532159443463111', name: 'Gheerwijn Clicque', gender: 'male'});
          alert(JSON.stringify(this.friends[0]));
        }.bind(this), function(error) {
          alert(error);
        })
      }
      else {
        alert('Not logged in!');
      }
    }.bind(this)) */

    // App friends
    this.storage.get('user').then((value) => {
      let userId = JSON.parse(value).id;
      this.db.getFriends(userId).map(res => res.json()).subscribe(response => {
        this.myFriends = Object.keys(response).map((key) => { return response[key]; });
      },
      error => {
        console.log(error);
      },
      () => console.log("Finished"));
    });
  }


  getChallenges() { // people that challenged you
    this.storage.get('user').then((value) => {
      let userId = JSON.parse(value).id;
      this.db.getChallenges(userId).map(res => res.json()).subscribe(response => {
          this.zone.run(() => {
            this.myChallenges = Object.keys(response).map((key) => { return response[key]; });

          });
          },
          error => {
            console.log(error);
          },
          () => console.log("Finished"));
    });
  }

  getMyChallenges() { // people you challenged

  }

  challengeDetail(challenge) {
    // TODO: check which page should be shown: if challenge is accepted -> show detail page w accept/decline, otherwise detail page without accept/decline
    // but with details (ngIf in view)
    this.navCtrl.push(ChallengeDetail, {challenge: challenge});
  }

  isChallenger(challenge) {
    if(challenge.challenger_id === parseInt(this.user_id)) {
      return true;
    }
    return false;
  }

}
