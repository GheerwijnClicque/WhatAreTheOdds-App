import { Component, ViewChild } from '@angular/core';
import { NavController, AlertController, Content, ToastController } from 'ionic-angular';

import { Facebook } from '@ionic-native/facebook';

import { Storage } from '@ionic/storage';

import { ChallengeDetail } from '../challenge-detail/challenge-detail';


import { DatabaseProvider } from '../../providers/database-provider';
import { SocketProvider } from '../../providers/socket-provider';

import { ChallengesPipe } from '../../app/pipes/challenges';
import { Keyboard } from '@ionic-native/keyboard';

import * as io from 'socket.io-client';

import { server } from '../../providers/server-info';

const URL = server.URL;

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

  private score: any;

  private enableSearch = false;
  private searchTerm = '';

  private enableNamePeek = false;
  private loading: boolean = true;

  constructor(public navCtrl: NavController, private pipe: ChallengesPipe, private keyboard: Keyboard, public fb: Facebook, 
              public storage: Storage, public db: DatabaseProvider, public alertCtrl: AlertController,
              private toastCtrl: ToastController, private socketProvider: SocketProvider) {
    storage.get('user').then((value) => {
        let userId = JSON.parse(value).id;

          this.getChallenges();
          this.getScore();
    });

    socketProvider.getSocket().then((socket) => {
      this.socket = socket;

      this.socket.on('challenge-add', (challenge) => {
          this.myChallenges.push(challenge)
          //this.content.scrollToBottom();
          //alert(this.myChallenges.length);
      });

      this.socket.on('challenge-update', (challenge) => {
          this.updateChallenge(challenge);
      });

      this.socket.on('score-update', (score) => {
          this.score = score;
          //this.storage.set('score', score);
      });

      
    }).catch((error) => {
      console.log(error);
    });

  }

  ionViewWillLeave() {
    //this.socket.close();
  }

  /**
   *
   * SOMETHING TO LET YOU KNOW IT'S YOUR TURN! MAYBE SLOWLY FADING OF THE CHALLENGE? OR SOMETHING MOVING?? 
   * 
   **/

  ionViewWillEnter() {

    this.storage.get('user').then((value) => {
      let userId = JSON.parse(value).id;

  
  

   /*   this.storage.get('score').then((score) => {
          this.score = score;
      }); */


    /*  this.db.getScore(userId).map(res => res.json()).subscribe(response => {
        this.zone.run(() => {
          this.storage.set('score', this.score);
          this.score = response;
        });
      },
      error => {
        console.log(error);
      },
      () => console.log("Finished")); */


      this.user_id = userId;
      //this.socket = io('http://' + URL + ':3000/', {query: 'data=' + userId})



  

  /*    this.socket.on('achievements-update', (achievements) => {
        alert('achievements');
        alert(achievements);
      }); */

    });
  }

  ionViewDidEnter() {
    this.storage.set('challengeCount', 0); // Reset badges


    // this.db.addUser('Gheerwijn', '1532159443463111');
   /* this.storage.get('test').then((test) => {
      console.log(test);
    }); */
          this.getChallenges();

  }

  doRefresh(refresher) {
      this.getChallenges();
      this.getScore();
      refresher.complete();
  }

  updateChallenge(challenge) {
      let object = this.myChallenges.find((obj) => {
          return obj.challenge_id === challenge.challenge_id;
      });
      let index = this.myChallenges.indexOf(object);
      this.myChallenges[index] = challenge;
  }

  getChallenges() {
    this.storage.get('user').then((value) => {
      let userId = JSON.parse(value).id;
      this.db.getChallenges(userId).map(res => res.json()).subscribe(response => {
          this.loading = false;
          this.myChallenges = Object.keys(response).map((key) => { return response[key]; });
      },
      error => {
        console.log(error);
      },
      () => console.log("Finished"));
    });
  }

  getScore() {
    this.storage.get('user').then((value) => {
      let userId = JSON.parse(value).id;
      this.db.getScore(userId).map(res => res.json()).subscribe(response => {
          this.score = response;
      },
      error => {
        console.log(error);
      },
      () => console.log("Finished"));
    });
  }
  
  challengeDetail(challenge) {
    // TODO: check which page should be shown: if challenge is accepted -> show detail page w accept/decline, otherwise detail page without accept/decline
    this.navCtrl.push(ChallengeDetail, {challenge: challenge});
  }

  isChallenger(challenge) {
    if(challenge.challenger_id === parseInt(this.user_id)) {
      return true;
    }
    return false;
  }

  myTurn(challenge) {
    if(this.isChallenger(challenge) && challenge.challenger_turn) {
      return true;
    }
    else if(!this.isChallenger(challenge) && !challenge.challenger_turn) {
      return true;
    }
    return false;
  }

  equalsGuesses(challenge) {
    if(parseInt(challenge.challenger_guess) === parseInt(challenge.challengee_guess)) {
      return true;
    }
    return false;
  }

  guessesMade(challenge) {
    if((challenge.challenger_guess && challenge.challengee_guess)) {
      return true;
    }
    return false;
  }

  toggleSearch() {
      this.enableSearch = !this.enableSearch;
      this.searchTerm = '';
  }

  search(ev: any) {
    this.searchTerm = ev.target.value;
  }

  // Handle hold on challenge
  handlePress(challenge) {
      challenge['peek'] = true;
      let time = setTimeout(() => {
          challenge['peek'] = false;
      }, 1000);
  }
}
