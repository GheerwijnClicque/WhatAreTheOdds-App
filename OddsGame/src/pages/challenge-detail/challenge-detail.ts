import { Component, NgZone } from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { Facebook } from '@ionic-native/facebook';

import { ChallengeRange } from '../challenge-range/challenge-range';
import { DatabaseProvider } from '../../providers/database-provider';

import * as io from 'socket.io-client';

@Component({
  selector: 'page-challenge-detail',
  templateUrl: 'challenge-detail.html'
})
export class ChallengeDetail {
  challenge: any;
  private user_id: any = 0;
  private guess: number = 1;

  private socket: any;


  constructor(public navCtrl: NavController, public storage: Storage, private modalCtrl: ModalController, private fb: Facebook, private zone: NgZone, private navParams: NavParams, private db: DatabaseProvider) {
    this.challenge = this.navParams.get('challenge');
    this.equalsGuesses();
  }

  ionViewWillLeave() {
    this.socket.close();
  }

  ionViewWillEnter() {
    this.storage.get('user').then((value) => {
      this.user_id = JSON.parse(value).id;

      this.socket = io('http://192.168.1.147:3000/', {query: 'data=' + this.user_id});

      this.socket.on('challenge-update', (challenge) => {
        this.zone.run(() => {
          this.challenge = challenge;
        })
      });
    });
  }

  accept() {
    let modal = this.modalCtrl.create(ChallengeRange, {challenge: this.challenge});
    modal.present();
    //this.navCtrl.push(ChallengeRange);
  }

  decline() {
    this.db.decline(this.challenge.challenge_id);

    // TODO: remove from database -> new field: rejected? updated_at
    // TODO: inform challenger!
    this.navCtrl.pop();
  }


  submitGuess() {
    this.storage.get('user').then((value) => {
      this.db.makeGuess(this.user_id, this.challenge.challenge_id, this.guess);
      if(this.isChallenger()) {
        this.challenge.challenger_guess = this.guess;
      }
      else {
        this.challenge.challengee_guess = this.guess;
      }
      this.equalsGuesses();
      this.navCtrl.pop();
    });
  }


  isChallenger() {
    if(this.challenge.challenger_id === parseInt(this.user_id)) {
      return true;
    }
    return false;
  }

  isAccepted() {
    return this.challenge.accepted;
  }

  hasRange() {
    if(this.challenge.range) {
      return true;
    }
    return false;
  }

  equalsGuesses() {
    if(this.guessesMade() && parseInt(this.challenge.challenger_guess) === parseInt(this.challenge.challengee_guess)) {
      return true;
    }
    return false;
  }

  guessesMade() {
    if((this.challenge.challenger_guess && this.challenge.challengee_guess)) {
      return true;
    }
    return false;
  }

  myTurn() {
    if(this.isChallenger() && this.challenge.challenger_turn) {
      return true;
    }
    else if(!this.isChallenger() && !this.challenge.challenger_turn) {
      return true;
    }
    return false;
  }



}
