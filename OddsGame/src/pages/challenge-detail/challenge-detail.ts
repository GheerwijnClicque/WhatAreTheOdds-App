import { Component, NgZone, ViewChild } from '@angular/core';
import { NavController, ModalController, NavParams, ActionSheetController, ToastController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { Facebook } from '@ionic-native/facebook';

import { ChallengeRange } from '../challenge-range/challenge-range';
import { DatabaseProvider } from '../../providers/database-provider';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { MediaCapture, CaptureVideoOptions } from '@ionic-native/media-capture';

import * as io from 'socket.io-client';

import { DomSanitizer } from '@angular/platform-browser'; // prevent XSS and such in image

import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';

import { server } from '../../providers/server-info';

import { UUID } from 'angular2-uuid';

const URL = server.URL;
const FILESERVERURL = server.FILESERVERURL;

@Component({
  selector: 'page-challenge-detail',
  templateUrl: 'challenge-detail.html'
})
export class ChallengeDetail {
  @ViewChild('myvideo') myVideo: any;
  challenge: any;
  private user_id: any = 0;
  private guess: number = 1;
  private serverInfo: any;
  private socket: any;
  private imageUrl: string = '';
  private videoData: any = '';

  private mediaSelected = false;
  private mediaFile: any;


  constructor(public navCtrl: NavController, public storage: Storage, private modalCtrl: ModalController, private fb: Facebook,
              private zone: NgZone, private navParams: NavParams, private db: DatabaseProvider, private actionSheetCtrl: ActionSheetController,
              private camera: Camera, private sanitizer: DomSanitizer, private transfer: Transfer, private toastCtrl: ToastController, private mediaCapture: MediaCapture) {
    this.challenge = this.navParams.get('challenge');
    this.equalsGuesses();
    this.serverInfo = server;
    console.log('serverInfo');
    console.log(this.serverInfo);
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

      this.socket.on('achievements-update', (achievements) => {
        if(achievements) {
          var message = 'Achievement "' + achievements[0].name + '" unlocked!';
          if(achievements.length > 1) {
              message += '(' + achievements.length + ' new)';
          }

          let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'top',
            cssClass: 'achievement-toast',
          });
          toast.present();
        }
      });
    });
  }

  accept() {
    let modal = this.modalCtrl.create(ChallengeRange, {challenge: this.challenge});
    modal.present();
    modal.onDidDismiss(data => {
      if(data) {
        //this.challenge.challenge = 'Accepted, wait for your turn';
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
          text: 'Take a picture',
          handler: () => {
            //this.takePicture(Camera.PictureSourceType.CAMERA);
            this.takePicture();
          }
        },
        {
          text: 'Record a video',
          handler: () => {
            //this.takePicture(Camera.PictureSourceType.CAMERA);
            this.recordVideo();
          }
        },
        {
          text: 'Select photo from Library',
          handler: () => {
            //this.takePicture(Camera.PictureSourceType.PHOTOLIBRARY);
            this.selectFromLibrary();
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
    mediaType: this.camera.MediaType.ALLMEDIA,
    sourceType: this.camera.PictureSourceType.CAMERA,
    saveToPhotoAlbum: false,
    allowEdit: false,
    targetWidth: 500,
    targetHeight: 500
  };

  takePicture() {
    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;

      this.mediaFile = base64Image;

      this.zone.run(() => {
        this.imageUrl = base64Image;
        this.mediaSelected = true;

      });
    }, (error) => {
      // Handle error
      //alert(error);
    });
  }

  selectFromLibrary() {
    let options = {
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      targetWidth: 500,
      targetHeight: 500
    };

    this.camera.getPicture(options).then((imageData) => {
      let base64Image = 'data:image/jpeg;base64,' + imageData;

      this.mediaFile = base64Image;

      this.zone.run(() => {
        this.imageUrl = base64Image;
        this.mediaSelected = true;
      });
    }, (error) => {

    });
  }

  removeImage() {
    this.imageUrl = '';
    this.mediaSelected = false;
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


    fileTransfer.upload(this.imageUrl, 'http://gheerwijnclicque.ikdoeict.be/fileserver.php', options)
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
    return this.challenge.image_url; // || this.image_url
  }

  isCompleted() {
    return this.challenge.completed;
  }

  judgeChallenge(state) {
    this.db.completed(this.user_id, this.challenge.challenge_id, state).subscribe(data => {
        console.log(data)
        this.challenge.completed = state;
        this.navCtrl.pop();
      },
      error => {
        console.log(error);
      },
      () => console.log("Finished"));
  }



 /* recordVideo() {
    this.mediaCapture.captureVideo((videodata) => {
      alert(JSON.stringify(videodata));
    });
  } */


 private opts: CaptureVideoOptions = {duration: 5};
 private showVideoPreview = false;

  recordVideo() {
    var that = this;
    this.showVideoPreview = true;

    this.mediaCapture.captureVideo(this.opts).then((data) => {
      let video = that.myVideo.nativeElement;

      this.videoData = data[0]['localURL'];
      this.mediaFile = data[0]['localURL'];
      //alert(JSON.stringify(data[0]));
      //alert(this.videoData);

      video.src = data[0]['fullPath'];
      
      this.mediaSelected = true;
    }).catch((error) => {
      alert('error: ' + error);
      this.showVideoPreview = false;

    });
  }

/*selectVideo() {
    let video = this.myVideo.nativeElement;
    var options = {
      sourceType: 2,
      mediaType: 1,
    }
    this.camera.getPicture(options).then((data) => {
      alert(data);
      this.videoData = data;
      video.src = data;
      video.play();
    }).catch((error) => {
      console.log(error);
    });
  }  */




  errorVideo: any;
  uploadSucceededVideo: boolean = false;
  uploadVideo() {
    //this.db.uploadImage(this.user_id, this.imageUrl);
    const fileTransfer: TransferObject = this.transfer.create();
    var video = JSON.stringify(this.videoData);
    alert('video: ' + this.videoData);

    let uuid = UUID.UUID();
   // var filename = 'testing.png';
    let options: FileUploadOptions = {
      fileKey: "file",
      fileName: uuid + '.mp4',
      chunkedMode: false,
      mimeType: "multipart/form-data",
      //mimeType: "video/mp4"
      //params : {'fileName': filename}
    }

    //fullPath or localURL
    fileTransfer.upload(this.videoData, 'http://192.168.1.148:8888/Web&MobileDev/Project/Server//fileserver.php', options)
        .then((data) => {
          // success
            alert('data: ' + data);

           /* this.db.uploadImageURL(this.user_id, options.fileName, this.challenge.challenge_id).subscribe(data => {
              //this.challenge.image_url = options.fileName;
              this.uploadSucceededVideo = true;
            },
            error => {
              alert('error: ' + error);
            },
            () => console.log("Finished")); */
        }, (err) => {
          // error
          this.errorVideo = JSON.stringify(err);
        });
  }


  universalUpload() {
    var data = this.mediaFile;

    alert(data);

    


  }


}
