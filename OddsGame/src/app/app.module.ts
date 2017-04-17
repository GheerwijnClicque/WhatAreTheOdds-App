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

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Facebook } from '@ionic-native/facebook';
import { Camera } from '@ionic-native/camera';
import { Transfer, TransferObject } from '@ionic-native/transfer';

import { IonicStorageModule } from '@ionic/storage';
import { DatabaseProvider } from '../providers/database-provider';

import { ChallengesPipe } from './pipes/challenges';
import { TimeSincePipe } from './pipes/timeSince';

import { HttpModule } from '@angular/http';

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
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
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
    ChallengeRange
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Facebook,
    DatabaseProvider,
    ChallengesPipe,
    Camera,
    Transfer

  ]
})
export class AppModule {}
