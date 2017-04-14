import { Injectable } from '@angular/core';
import { Network } from 'ionic-native';


import 'rxjs/add/operator/map';
import * as io from 'socket.io-client';

@Injectable()
export class SocketProvider {
  private socket: any;

  constructor(userId) {
    this.socket = io('http://192.168.1.147:3000/', {query: 'data=' + userId});
  }

}
