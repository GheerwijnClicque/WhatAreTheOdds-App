import { Component } from '@angular/core';
import { NavController, ViewController, NavParams } from 'ionic-angular';

@Component({
  template: `
    <div>
        <span>Achieved for having {{achievement.rule}}!</span> 
    </div>
  `
})
export class PopoverPage {
    private achievement: any;

  constructor(public viewCtrl: ViewController, private navParams: NavParams) {
    this.achievement = this.navParams.get('achievement');
    console.log(this.achievement);
  }

  close() {
    this.viewCtrl.dismiss();
  }
}