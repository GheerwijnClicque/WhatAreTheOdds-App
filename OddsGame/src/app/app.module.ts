import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HighscoresPage } from '../pages/highscores/highscores';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { Login } from '../pages/login/login';
import { Challenge } from '../pages/challenge/challenge';
import { ChallengeDetail } from '../pages/challenge-detail/challenge-detail';
import { ChallengeRange } from '../pages/challenge-range/challenge-range';
import { FriendsPage } from '../pages/friends/friends';
import { PopoverPage } from '../pages/popover/popover';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Facebook } from '@ionic-native/facebook';
import { Camera } from '@ionic-native/camera';
import { MediaCapture } from '@ionic-native/media-capture';
import { Transfer, TransferObject } from '@ionic-native/transfer';

import { IonicStorageModule } from '@ionic/storage';
import { DatabaseProvider } from '../providers/database-provider';

import { ChallengesPipe } from './pipes/challenges';
import { TimeSincePipe } from './pipes/timeSince';
import { SearchByName } from './pipes/search';
import { SearchByChallenge} from './pipes/search';

import { HttpModule } from '@angular/http';
import { Keyboard } from '@ionic-native/keyboard';
import { NgSwitch, NgSwitchCase } from '@angular/common';

import { UUID } from 'angular2-uuid';

@NgModule({
  declarations: [
    MyApp,
    HighscoresPage,
    ContactPage,
    HomePage,
    TabsPage,
    FriendsPage,
    Login,
    Challenge,
    ChallengeDetail,
    ChallengeRange,
    ChallengesPipe,
    TimeSincePipe,
    SearchByName,
    SearchByChallenge,
    PopoverPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      scrollAssist: false,
      autoFocusAssist: false
    }),
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HighscoresPage,
    ContactPage,
    HomePage,
    TabsPage,
    FriendsPage,
    Login,
    Challenge,
    ChallengeDetail,
    ChallengeRange,
    PopoverPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Facebook,
    DatabaseProvider,
    ChallengesPipe,
    Camera,
    MediaCapture,
    Transfer,
    Keyboard,
    NgSwitch,
    NgSwitchCase
  ]
})
export class AppModule {}
