import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Facebook } from '@ionic-native/facebook';

import { DatabaseProvider } from '../../providers/database-provider';
import { SearchByName } from '../../app/pipes/search';
import { FriendsFilter } from '../../app/pipes/friendsFilter';


@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html'
})
export class FriendsPage {
  users: any;
  friends: any;

  backupUsers: any;

  searchTerm: string = '';

  user_id: any = 0;

  constructor(public navCtrl: NavController, private db: DatabaseProvider, private storage: Storage, private alertCtrl: AlertController,
              private pipe: FriendsFilter, public fb: Facebook) {
    this.getUsers();
  
  }

  getUsers() {
    this.storage.get('user').then((value) => {
      let userID = JSON.parse(value).id;
      this.db.getUsers().map(res => res.json()).subscribe(response => {
            let users = Object.keys(response).map((key) => { return response[key]; });
            this.users = users.filter(function(user) { // Remove current user
              if(user.facebook_id !== parseInt(userID)) {
                return user;
              }
            });
      },
      error => {
        console.log(error);
      },
      () => console.log("Finished"));
    });
  }
/*
  // Not implemented yet to make testing easier!
  getfriends() {
    this.fb.getLoginStatus().then(function(response) {
      if(response.status == 'connected') {
        this.fb.api("/" + response.authResponse.userID + "/friends", []).then(function onSuccess(response) {
          // Get users and return duplicates
          this.friends = Object.keys(response.data).map((key) => { return response.data[key]; });
        }.bind(this), function(error) {
          alert(error);
        })
      }
      else {
        alert('Not logged in!');
      }
    }.bind(this)) 
  } */

  search(ev: any) {
    this.searchTerm = ev.target.value;
  }

  addAsFriend(user) {
    this.storage.get('user').then((value) => {
      let userId = JSON.parse(value).id;
      this.db.addFriend(userId, user.facebook_id);
    });
  }

  // Challenge user
  challenge(user) {
    let prompt = this.alertCtrl.create({
      title: 'Challenge',
      cssClass: 'alert-message',
      message: "What are the odds that you will...",
      enableBackdropDismiss: true,
      inputs: [
        {
          name: 'challenge',
          placeholder: 'e.g. keep your hands up for 1h?',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          cssClass: 'cancel-button'
        },
        {
          text: 'Challenge',
          cssClass: 'challenge-button',
          handler: data => {
            console.log('Saved clicked');
            console.log(data.challenge.length);
            if(data.challenge !== '' && data.challenge.length <= 30) {
              this.storage.get('user').then((value) => {
                let userId = JSON.parse(value).id;
                this.db.challenge(userId, user.facebook_id, data.challenge);
              });
            }
          }
        }
      ]
    });
    prompt.present();
  }
}
