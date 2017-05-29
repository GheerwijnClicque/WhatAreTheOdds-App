import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { DatabaseProvider } from '../../providers/database-provider';

@Component({
  selector: 'page-highscores',
  templateUrl: 'highscores.html'
})
export class HighscoresPage {
  highscores: any;

  constructor(public navCtrl: NavController, private db: DatabaseProvider, private alertCtrl: AlertController, private storage: Storage) {

  }

  ionViewWillEnter() {
      this.db.getHighscores().map(res => res.json()).subscribe(response => {
        this.highscores = Object.keys(response).map((key) => { return response[key]; });
      },
      error => {
        console.log(error);
      },
      () => console.log("Finished"));
  }


  challengeUser(user) {
    let prompt = this.alertCtrl.create({
      title: 'Challenge',
      message: "What are the odds that you will...",
      inputs: [
        {
          name: 'challenge',
          placeholder: 'e.g. keep your hands up for 1h?'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked');
            //this.challenge = data.challenge;
            this.storage.get('user').then((value) => {
              let userId = JSON.parse(value).id;
              this.db.challenge(userId, user.facebook_id, data.challenge);
            });
          }
        }
      ]
    });
    prompt.present();
  }

}
