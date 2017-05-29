import { Injectable } from '@angular/core';
import { Network } from 'ionic-native';


import 'rxjs/add/operator/map';
import * as io from 'socket.io-client';
import { server } from './server-info';
import { Storage } from '@ionic/storage';

const URL = server.URL

@Injectable()
export class SocketProvider {
  private socket: any;
  private isConnected: boolean = false;

  constructor(private storage: Storage) {
    console.log('make socket');

  }

  getSocket() {
    return new Promise((resolve, reject) => {
              console.log('promise');
              console.log(this.socket);
        if(this.isConnected) {
          if(this.socket) {
            resolve(this.socket);
          }
          else {
            var interval = setInterval(() => {
              if(this.socket) {
                clearInterval(interval);
                resolve(this.socket);
              }
            }, 50);
          }
        }
        else {
          this.isConnected = true;
          this.storage.get('user').then((value) => {
            let userId = JSON.parse(value).id;

            this.socket = io('http://' + URL + ':3000/', {query: 'data=' + userId});
            this.socket.on('connect', () => {
                resolve(this.socket);
            });
          });
        }
    });
  }


}
