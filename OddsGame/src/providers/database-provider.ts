import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Network } from 'ionic-native';


import 'rxjs/add/operator/map';
import * as io from 'socket.io-client';

//const URL = 'http://5e02351a.ngrok.io/';
const URL = 'http://192.168.1.147:3000/';

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DatabaseProvider {
  private socket: any;

  constructor(private http: Http) {
    console.log('Hello DatabaseProvider Provider');
  }

  addUser(name, facebook_id) {
    console.log('add user request!');
    this.http.post(URL + 'user/add', {
      name: name,
      id: facebook_id
    }).subscribe(data => {
      console.log(data);
    },
    error => {
      console.log('error');
      console.log(JSON.stringify(error));
    },
    () => console.log("Finished"));
  }

  addFriend(user, friend) {
    console.log('add friend request!');
    this.http.post(URL + 'user/friends/add', {
      user: user,
      friend: friend
    }).subscribe(data => {
      console.log(data);
    },
    error => {
      console.log(error);
    },
    () => console.log("Finished"));
  }

  getFriends(userId) {
    console.log('get friends request!');
    return this.http.get(URL + userId + '/friends');
  }

  challenge(challengerId, challengeeId, challenge) {
    console.log('challenge a friend request!');
    console.log(URL + 'challenge');

    this.http.post(URL + 'challenge', {
      challengerId: challengerId,
      challengeeId: challengeeId,
      challenge: challenge
    }).subscribe(data => {
      console.log(data);
    },
    error => {
      console.log(error);
    },
    () => console.log("Finished"));
  }

  getChallenges(userId) {
    console.log('get challenges request!');
    return this.http.get(URL + userId + '/challenges');
  }

  accept(userId, challengeId, range) {
    console.log('set range for a challenge request!');
    this.http.post(URL + 'challenge/accept', {
      challenge: challengeId,
      range: range,
      user: userId
    }).subscribe(data => {
      console.log(data);
    },
    error => {
      console.log(error);
    },
    () => console.log("Finished"));
  }

  decline(challengeId) {
    console.log('decline challenge request');
    this.http.post(URL + 'challenge/decline', {
      challenge: challengeId,
    }).subscribe(data => {
      console.log(data);
    },
    error => {
      console.log(error);
    },
    () => console.log("Finished"));
  }

  getUsers() {
    return this.http.get(URL + 'users');
  }

  makeGuess(userId, challengeId, guess) {
    this.http.post(URL + 'challenge/guess', {
      challenge: challengeId,
      guess: guess,
      user: userId
    }).subscribe(data => {
      console.log(data);
    },
    error => {
      console.log(error);
    },
    () => console.log("Finished"));
  }

}
