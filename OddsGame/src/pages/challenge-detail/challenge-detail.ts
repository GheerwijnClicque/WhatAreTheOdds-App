import {Component, NgZone, ViewChild} from '@angular/core';
import {
    NavController,
    ModalController,
    AlertController,
    NavParams,
    ActionSheetController,
    ToastController
} from 'ionic-angular';

import {Storage} from '@ionic/storage';

import {Facebook} from '@ionic-native/facebook';

import {ChallengeRange} from '../challenge-range/challenge-range';
import {DatabaseProvider} from '../../providers/database-provider';
import {SocketProvider} from '../../providers/socket-provider';

import {Camera, CameraOptions} from '@ionic-native/camera';
import {MediaCapture, CaptureVideoOptions} from '@ionic-native/media-capture';

import {DomSanitizer} from '@angular/platform-browser'; // prevent XSS and such in image

import {Transfer, FileUploadOptions, TransferObject} from '@ionic-native/transfer';

import {server} from '../../providers/server-info';

import {UUID} from 'angular2-uuid';

@Component({
    selector: 'page-challenge-detail',
    templateUrl: 'challenge-detail.html'
})
export class ChallengeDetail {
    @ViewChild('myvideo') myVideo: any;
    private challenge: any;
    private user_id: any = 0;
    private guess: number = 0;
    private serverInfo: any;
    private socket: any;
    private interval: any;

    private mediaSelected: boolean = false;
    private mediaFile: any = '';

    private photoOptions: CameraOptions = {
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
    private videoOptions: CaptureVideoOptions = {duration: 5};
    private showVideoPreview = false;

    constructor(public navCtrl: NavController, public storage: Storage, private modalCtrl: ModalController, private fb: Facebook,
                private zone: NgZone, private navParams: NavParams, private db: DatabaseProvider, private actionSheetCtrl: ActionSheetController,
                private camera: Camera, private sanitizer: DomSanitizer, private transfer: Transfer, private toastCtrl: ToastController, private mediaCapture: MediaCapture,
                private socketProvider: SocketProvider, private alertCtrl: AlertController) {

        this.challenge = this.navParams.get('challenge');
        this.serverInfo = server;

        socketProvider.getSocket().then((socket) => {
            this.socket = socket;

            this.socket.on('challenge-update', (challenge) => {
                this.challenge = challenge;
            });
        }).catch((error) => {
            console.log(error);
        });

        this.storage.get('user').then((value) => {
            this.user_id = JSON.parse(value).id;
        });
    }

    accept() {
        let modal = this.modalCtrl.create(ChallengeRange, {challenge: this.challenge});
        modal.present();
    }

    decline() {
        this.db.decline(this.challenge.challenge_id);
        this.navCtrl.pop();
    }

    decreaseGuess() {
        if (this.guess > 0) {
            this.guess--;
        }
    }

    increaseGuess(max) {
        if (this.guess >= 0 && this.guess < max) {
            this.guess++;
        }
    }

    handleIncrease(max, running) { // Handle increase button hold
        if (running) {
            this.interval = setInterval(() => {
                if (this.guess >= 0 && this.guess < max) {
                    this.guess++;
                }
            }, 100);
        }
        else {
            clearInterval(this.interval);
        }
    }

    handleDecrease(running) { // Handle decrease button hold
        if (running) {
            this.interval = setInterval(() => {
                if (this.guess > 0) {
                    this.guess--;
                }
            }, 100);
        }
        else {
            clearInterval(this.interval);
        }
    }

    submitGuess() {
        this.storage.get('user').then((value) => {

            this.user_id = JSON.parse(value).id; // Move this to constructor!!
            this.db.makeGuess(this.user_id, this.challenge.challenge_id, this.guess);
            if (this.isChallenger()) {
                this.challenge.challenger_guess = this.guess;
            }
            else {
                this.challenge.challengee_guess = this.guess;
            }
            this.equalsGuesses();
            //this.navCtrl.pop();
        });
    }

    isChallenger() {
        if (this.challenge.challenger_id === parseInt(this.user_id)) {
            return true;
        }
        return false;
    }

    isAccepted() {
        return this.challenge.accepted;
    }

    hasRange() {
        if (this.challenge.range) {
            return true;
        }
        return false;
    }

    equalsGuesses() {
        if (this.guessesMade() && parseInt(this.challenge.challenger_guess) === parseInt(this.challenge.challengee_guess)) {
            return true;
        }
        return false;
    }

    guessesMade() {
        if ((this.challenge.challenger_guess && this.challenge.challengee_guess)) {
            return true;
        }
        return false;
    }

    myTurn() {
        if (this.isChallenger() && this.challenge.challenger_turn) {
            return true;
        }
        else if (!this.isChallenger() && !this.challenge.challenger_turn) {
            return true;
        }
        return false;
    }

    presentActionSheet() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Select Image Source',
            buttons: [
                {
                    text: 'Take a picture',
                    handler: () => {
                        this.takePicture();
                    }
                },
                {
                    text: 'Record a video',
                    handler: () => {
                        this.recordVideo();
                    }
                },
                {
                    text: 'Select photo from Library',
                    handler: () => {
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

  

    hasImage() {
        return this.challenge.media_file; 
    }

    isCompleted() {
        return (this.challenge.completed === 1);
    }

    // Challenge completed or not
    judgeChallenge(state) {
        this.db.completed(this.user_id, this.challenge.challenge_id, state).subscribe(data => {
            this.challenge.completed = state;
            this.navCtrl.pop();
        },
        error => {
            console.log(error);
        },
        () => console.log("Finished"));
    }

  // Take picture with camera and save base64
    takePicture() {
        this.camera.getPicture(this.photoOptions).then((imageData) => {
            let base64Image = 'data:image/jpeg;base64,' + imageData;
            this.mediaFile = base64Image;
            this.mediaSelected = true;
        }, (error) => {
            console.log(error);
        });
    }

    // Select photo from library
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
            this.mediaSelected = true;
        }, (error) => {
            console.log(error);
        });
    }

    // Remove current media
    removeMedia() {
        this.mediaSelected = false;
        this.showVideoPreview = false;
        this.mediaFile = '';
    }

    // Record video
    recordVideo() {
        var that = this;
        this.showVideoPreview = true;

        this.mediaCapture.captureVideo(this.videoOptions).then((data) => {
            let video = that.myVideo.nativeElement;
            this.mediaFile = data[0]['localURL'];

            video.src = data[0]['fullPath'];
            video.load(); // Load video in to preview

            this.mediaSelected = true;
        }).catch((error) => {
            alert('error: ' + error);
            this.showVideoPreview = false;

        });
    }

    // Check if media file is a video
    mediaIsVideo() {
        var media = this.challenge.media_file;
        return (media.substring(media.length - 4, media.length) === '.mp4');
    }

    // Upload video and photo to fileserver
    universalUpload() {
        var data = this.mediaFile;
        const fileTransfer: TransferObject = this.transfer.create();
        var filename = '';

        let uuid = UUID.UUID();

        if (data.substring(data.length - 4, data.length) === '.MOV') { // If media is video
            filename = uuid + '.mp4';
        }
        else { // if media is image
            filename = uuid + '.jpg';
        }

        let options: FileUploadOptions = {
            fileKey: "file",
            fileName: filename,
            chunkedMode: false,
            mimeType: "multipart/form-data",
        }

        fileTransfer.upload(this.mediaFile, 'http://192.168.1.148:8888/Web&MobileDev/Project/Server/fileserver.php', options)
            .then((data) => {
                this.db.uploadMedia(this.user_id, options.fileName, this.challenge.challenge_id).subscribe(data => {
                        this.challenge.media_file = options.fileName;
                    },
                    error => {
                        console.log(error);
                    },
                    () => console.log("Finished"));

            }, (error) => {
                console.log(JSON.stringify(error));
            });
    }

    // Challenge other user after failed challenge
    newChallenge() {
        let prompt = this.alertCtrl.create({
            title: 'Challenge ' + (this.isChallenger() ? this.challenge.challengee_name : this.challenge.challenger_name),
            cssClass: 'alert-message',
            message: "What are the odds that you will...",
            enableBackdropDismiss: true,
            inputs: [
                {
                    name: 'challenge',
                    placeholder: 'e.g. keep your hands up for 1h?',
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    cssClass: 'cancel-button'
                },
                {
                    text: 'Challenge',
                    cssClass: 'challenge-button',
                    handler: data => {
                        if (data.challenge !== '' && data.challenge.length <= 30) {
                            this.storage.get('user').then((value) => {
                                let userId = JSON.parse(value).id;

                                if (this.isChallenger()) {
                                    this.db.challenge(userId, this.challenge.challengee_id, data.challenge);
                                }
                                else {
                                    this.db.challenge(userId, this.challenge.challenger_id, data.challenge);
                                }
                            });
                        }
                    }
                }
            ]
        });
        prompt.present();
    }
}
