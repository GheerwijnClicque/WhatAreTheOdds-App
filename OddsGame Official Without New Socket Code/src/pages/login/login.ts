import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';

import { Facebook } from '@ionic-native/facebook';

import { Storage } from '@ionic/storage';

import {HomePage} from "../home/home";

import {TabsPage} from "../tabs/tabs";

import { DatabaseProvider } from '../../providers/database-provider';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class Login {

  constructor(public navCtrl: NavController, public fb: Facebook, public storage: Storage, public db: DatabaseProvider, public modalCtrl: ModalController, public viewCtlr: ViewController) {
    storage.get('test').then((value) => {
      console.log(value);
      //this.navCtrl.push(HomePage);
    });
  }


  login() {
    let context = this;
    this.fb.login(['public_profile', 'email', 'user_friends']).then(function(response) {
      //alert('logged in');
      //alert(JSON.stringify(response.authResponse));

      this.getdetails();
    }.bind(this), function(error) {
      //alert('error!' + error);
    }.bind(this))
  }

  getdetails() {
   // let context = this;
    this.fb.getLoginStatus().then(function(response) {
      if(response.status == 'connected') {
        //alert(JSON.stringify(response));
        //let id = '117195915492023';
        let id = response.authResponse.userID;
        this.fb.api("/" + id + "?fields=id,name,gender", ['public_profile', 'email', 'user_friends']).then(function onSuccess(response) {
          alert(JSON.stringify(response));
          this.storage.set('user', JSON.stringify(response));
          this.db.addUser(response.name, response.id);
          this.navCtrl.setRoot(TabsPage);
        }.bind(this), function(error) {
          alert(error);
        })
      }
      else {
        alert('Not logged in!');
      }
    }.bind(this))
  }

  goHome() {
  /*  this.viewCtlr.dismiss().then((value) => {
      console.log(value);
    }, (error) => {
      console.log('error: ' + error);
    }); */
    this.navCtrl.setRoot(TabsPage);

    console.log('bye');
  }
}
