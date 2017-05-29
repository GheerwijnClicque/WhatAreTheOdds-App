import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { Login } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { ContactPage } from '../pages/contact/contact';

import { Storage } from '@ionic/storage';
import { Keyboard } from '@ionic-native/keyboard';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = Login;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, storage: Storage, keyboard: Keyboard) {
    storage.get('user').then((value) => {
      //alert(value + ' is logged in!');
      if(value !== null) {
        this.rootPage = TabsPage;
      }
      else {
        this.rootPage = Login;
      }
    });





    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();


        keyboard.disableScroll(true);

      //storage.set('test', 'BOOOOOOEM!');
      //storage.remove('test');

    });
  }


}
