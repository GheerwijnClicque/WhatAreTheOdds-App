import { Component } from '@angular/core';

import { HighscoresPage } from '../highscores/highscores';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { FriendsPage } from '../friends/friends';

import { DatabaseProvider } from '../../providers/database-provider';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = FriendsPage;
  tab3Root = HighscoresPage;
  tab4Root = ContactPage;


  constructor(private db: DatabaseProvider, private storage: Storage) {
    /*storage.get('score').then((value) => {


    }, (error) => {
      alert(error);
    }); */
  }

  ionViewWillEnter() {

  }
}
