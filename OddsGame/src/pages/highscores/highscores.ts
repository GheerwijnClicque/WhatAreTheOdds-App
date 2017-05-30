import { Component } from '@angular/core';

import { DatabaseProvider } from '../../providers/database-provider';

@Component({
  selector: 'page-highscores',
  templateUrl: 'highscores.html'
})
export class HighscoresPage {
  highscores: any;

  constructor(private db: DatabaseProvider) {}

  ionViewWillEnter() {
      this.db.getHighscores().map(res => res.json()).subscribe(response => {
        this.highscores = Object.keys(response).map((key) => { return response[key]; }).filter((item, index) => { return index < 10 });
      },
      error => {
        console.log(error);
      },
      () => console.log("Finished"));
  }
}
