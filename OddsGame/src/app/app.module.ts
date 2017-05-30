import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler, Tabs } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { NgSwitch, NgSwitchCase } from '@angular/common';

//Pages
import { HighscoresPage } from '../pages/highscores/highscores';
import { ProfilePage } from '../pages/profile/profile';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { Login } from '../pages/login/login';
import { ChallengeDetail } from '../pages/challenge-detail/challenge-detail';
import { ChallengeRange } from '../pages/challenge-range/challenge-range';
import { FriendsPage } from '../pages/friends/friends';
//import { PopoverPage } from '../pages/popover/popover';

// Native plugins
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Facebook } from '@ionic-native/facebook';
import { Camera } from '@ionic-native/camera';
import { MediaCapture } from '@ionic-native/media-capture';
import { Transfer } from '@ionic-native/transfer';
import { Keyboard } from '@ionic-native/keyboard';
import { IonicStorageModule } from '@ionic/storage';

// Providers
import { DatabaseProvider } from '../providers/database-provider';
import { SocketProvider } from '../providers/socket-provider';
import { UserInfoProvider } from '../providers/user-info';

// Pipes
import { ChallengesPipe } from './pipes/challenges';
import { TimeSincePipe } from './pipes/timeSince';
import { SearchByName } from './pipes/search';
import { SearchByChallenge } from './pipes/search';
import { FriendsFilter } from './pipes/friendsFilter';




@NgModule({
  declarations: [
    MyApp,
    HighscoresPage,
    ProfilePage,
    HomePage,
    TabsPage,
    FriendsPage,
    Login,
    ChallengeDetail,
    ChallengeRange,
    ChallengesPipe,
    TimeSincePipe,
    SearchByName,
    SearchByChallenge,
    FriendsFilter,
    //PopoverPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      platforms: {
        ios: {
          scrollAssist: false,
          autoFocusAssist: false
        }
      }
    }),
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HighscoresPage,
    ProfilePage,
    HomePage,
    TabsPage,
    FriendsPage,
    Login,
    ChallengeDetail,
    ChallengeRange,
    //PopoverPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Facebook,

    DatabaseProvider,
    UserInfoProvider,
    SocketProvider,

    ChallengesPipe,
    FriendsFilter,

    Camera,
    MediaCapture,
    Transfer,
    Keyboard,
    NgSwitch,
    NgSwitchCase,
    Tabs,
    Keyboard
  ]
})
export class AppModule {}
