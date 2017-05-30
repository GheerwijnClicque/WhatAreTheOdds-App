import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { Login } from '../pages/login/login';

import { Storage } from '@ionic/storage';
import { Keyboard } from '@ionic-native/keyboard';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = Login;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, storage: Storage, keyboard: Keyboard) {
    storage.get('user').then((value) => {
      if(value !== null) {
        this.rootPage = TabsPage;
      }
      else {
        this.rootPage = Login;
      }
    });

    platform.ready().then(() => {
      statusBar.styleDefault();
      statusBar.styleLightContent();

      splashScreen.hide();

      if(platform.is('ios')) {
       // keyboard.disableScroll(true);
      }

    });
  }


}
