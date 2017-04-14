import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { Facebook } from '@ionic-native/facebook';

import { Login } from '../login/login';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  user: any = {name: 'test'};

  constructor(public navCtrl: NavController, public storage: Storage, private fb: Facebook, private modalCtrl: ModalController) {
    storage.get('user').then(function(value) {
      this.user = JSON.parse(value);
    }.bind(this));
  }

  logout() {
    this.fb.logout().then(function(response) {
      alert(JSON.stringify(response));
      this.storage.remove('user');
      //this.navCtrl.setRoot(Login);
      let loginModal = this.modalCtrl.create(Login);
      loginModal.present();
    }.bind(this), function(error) {
      alert(error);
    })
  }

  request() {
    //this.db.addUser('TestUser1', '1234563');
  }
}
