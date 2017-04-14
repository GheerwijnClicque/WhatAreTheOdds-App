import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import {HomePage} from "../home/home";

import {TabsPage} from "../tabs/tabs";

import { DatabaseProvider } from '../../providers/database-provider';


@Component({
  selector: 'page-challenge-range',
  templateUrl: 'challenge-range.html'
})
export class ChallengeRange {
  private challenge: any;
  private user_id: any = 0;

  private guesses: any = [0, 5, 10, 20, 50, 100];
  private guess: number = 0;

  constructor(public navCtrl: NavController, public storage: Storage, public db: DatabaseProvider, public navParams: NavParams, public viewCtrl: ViewController) {
    this.challenge = navParams.get('challenge');
    this.storage.get('user').then((value) => {
      this.user_id = JSON.parse(value).id;
    });
  }

  selectGuess(guess) {
    this.guess = guess;
  }

  submit() {
    this.db.accept(this.user_id, this.challenge.challenge_id, this.guess);
    this.viewCtrl.dismiss();
   // this.navCtrl.pop();
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

}
