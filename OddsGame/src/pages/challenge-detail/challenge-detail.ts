import { Component, NgZone } from '@angular/core';
import { NavController, ModalController, NavParams, ActionSheetController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { Facebook } from '@ionic-native/facebook';

import { ChallengeRange } from '../challenge-range/challenge-range';
import { DatabaseProvider } from '../../providers/database-provider';

import { Camera, CameraOptions } from '@ionic-native/camera';

import * as io from 'socket.io-client';

import { DomSanitizer } from '@angular/platform-browser'; // prevent XSS and such in image

import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';

import { server } from '../../providers/server-info';

const URL = server.URL;

@Component({
  selector: 'page-challenge-detail',
  templateUrl: 'challenge-detail.html'
})
export class ChallengeDetail {
  challenge: any;
  private user_id: any = 0;
  private guess: number = 1;

  private socket: any;


  constructor(public navCtrl: NavController, public storage: Storage, private modalCtrl: ModalController, private fb: Facebook,
              private zone: NgZone, private navParams: NavParams, private db: DatabaseProvider, private actionSheetCtrl: ActionSheetController,
              private camera: Camera, private sanitizer: DomSanitizer, private transfer: Transfer) {
    this.challenge = this.navParams.get('challenge');
    this.equalsGuesses();
  }

  ionViewWillLeave() {
    this.socket.close();
  }

  ionViewWillEnter() {
    this.storage.get('user').then((value) => {
      this.user_id = JSON.parse(value).id; // Move this to constructor!!

      this.socket = io('http://' + URL + ':3000/', {query: 'data=' + this.user_id});

      this.socket.on('challenge-update', (challenge) => {
        this.zone.run(() => {
          this.challenge = challenge;
        })
      });
    });
  }

  accept() {
    let modal = this.modalCtrl.create(ChallengeRange, {challenge: this.challenge});
    modal.present();
    modal.onDidDismiss(data => {
      if(data) {
        this.challenge.challenge = 'Accepted, wait for your turn';
        // TODO: remove buttons and show turn?
        //this.navCtrl.pop();
      }
    });
    //this.navCtrl.push(ChallengeRange);
  }

  decline() {
    this.db.decline(this.challenge.challenge_id);

    // TODO: remove from database -> new field: rejected? updated_at
    // TODO: inform challenger!
    this.navCtrl.pop();
  }


  submitGuess() {
    this.storage.get('user').then((value) => {
      this.db.makeGuess(this.user_id, this.challenge.challenge_id, this.guess);
      if(this.isChallenger()) {
        this.challenge.challenger_guess = this.guess;
      }
      else {
        this.challenge.challengee_guess = this.guess;
      }
      this.equalsGuesses();
      //this.navCtrl.pop();
    });
  }

  ////// Make this something global or in a service? //////
  isChallenger() {
    if(this.challenge.challenger_id === parseInt(this.user_id)) {
      return true;
    }
    return false;
  }

  isAccepted() {
    return this.challenge.accepted;
  }

  hasRange() {
    if(this.challenge.range) {
      return true;
    }
    return false;
  }

  equalsGuesses() {
    if(this.guessesMade() && parseInt(this.challenge.challenger_guess) === parseInt(this.challenge.challengee_guess)) {
      return true;
    }
    return false;
  }

  guessesMade() {
    if((this.challenge.challenger_guess && this.challenge.challengee_guess)) {
      return true;
    }
    return false;
  }

  myTurn() {
    if(this.isChallenger() && this.challenge.challenger_turn) {
      return true;
    }
    else if(!this.isChallenger() && !this.challenge.challenger_turn) {
      return true;
    }
    return false;
  }
  /////// ///////

   presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            //this.takePicture(Camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            //this.takePicture(Camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  private options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.CAMERA,
    saveToPhotoAlbum: false,
    allowEdit: false,
    targetWidth: 500,
    targetHeight: 500
  };

  imageUrl: any;
  takePicture() {
    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.zone.run(() => {
        this.imageUrl = base64Image;
      });
    }, (error) => {
      // Handle error
      //alert(error);
    });
  }

  selectFromLibrary() {
    let options = {
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      targetWidth: 500,
      targetHeight: 500
    };

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.zone.run(() => {
        this.imageUrl = base64Image;
      });
    }, (error) => {

    });
  }

  error: any;
  uploadSucceeded: boolean = false;
  upload() {
    //this.db.uploadImage(this.user_id, this.imageUrl);
    const fileTransfer: TransferObject = this.transfer.create();

    var filename = 'testing.png';
    let options: FileUploadOptions = {
      fileKey: "file",
      fileName: this.challenge.challenge_id + '.jpeg',
      chunkedMode: false,
      mimeType: "multipart/form-data",

      //params : {'fileName': filename}

    }


    fileTransfer.upload(this.imageUrl, 'http://192.168.0.199:8888/Web&MobileDev/Project/Server/fileserver.php', options)
        .then((data) => {
          // success
            this.db.uploadImageURL(this.user_id, options.fileName, this.challenge.challenge_id).subscribe(data => {
              console.log(data)
              this.challenge.image_url = options.fileName;
              this.uploadSucceeded = true;
            },
            error => {
              console.log(error);
            },
            () => console.log("Finished"));
        }, (err) => {
          // error
          this.error = JSON.stringify(err);
        });
  }

  hasImage() {
    return this.challenge.image_url;
  }

  isCompleted() {
    return this.challenge.completed;
  }

  judgeChallenge(state) {
    this.db.completed(this.user_id, this.challenge.challenge_id, state).subscribe(data => {
        console.log(data)
        this.challenge.completed = state;
      },
      error => {
        console.log(error);
      },
      () => console.log("Finished"));
  }

}
