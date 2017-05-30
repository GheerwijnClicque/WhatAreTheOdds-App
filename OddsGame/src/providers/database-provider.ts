import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import 'rxjs/add/operator/map';

import {server} from '../providers/server-info';

const URL = 'http://' + server.getURL() + ':3000/';

@Injectable()
export class DatabaseProvider {
    private socket: any;

    constructor(private http: Http) {
        console.log('DatabaseProvider up and running!');
    }

    addUser(name, facebook_id) {
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
        return this.http.get(URL + userId + '/friends');
    }

    challenge(challengerId, challengeeId, challenge) {
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
        return this.http.get(URL + userId + '/challenges');
    }

    accept(userId, challengeId, range) {
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

    getScore(userId) {
        return this.http.get(URL + userId + '/score');
    }

    uploadMedia(userId, url, challengeId) {
        return this.http.post(URL + 'file', {
            url: url,
            challenge: challengeId,
            user: userId
        });
    }

    completed(userId, challengeId, state) {
        return this.http.post(URL + 'completed', {
            completed: state,
            challenge: challengeId,
            user: userId
        });
    }

    getHighscores() {
        return this.http.get(URL + 'highscores');
    }

    getStatistics(userId) {
        return this.http.get(URL + userId + '/statistics');
    }

    getAchievements(userId) {
        return this.http.get(URL + userId + '/achievements');
    }
}
