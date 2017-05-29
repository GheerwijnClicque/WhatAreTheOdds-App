import { Injectable, Pipe } from '@angular/core';

@Pipe({
    name: 'TimeSincePipe'
})
@Injectable()
export class TimeSincePipe {
    transform(value, args?) {

        let date = new Date(0);
        date.setUTCSeconds(value);

        return this.timeSince(date);
    }

    timeSince(date) {
        let seconds = Math.floor((+new Date() - date) / 1000);
        let interval = Math.floor(seconds / 31536000);

       if (interval > 1) {
            return interval + " years";
        }
        interval = Math.floor(seconds / 2592000);
        if (interval > 1) {
            return interval + " months";
        }
        interval = Math.floor(seconds / 86400);
        if (interval > 1) {
            return interval + "d";
        }
        interval = Math.floor(seconds / 3600);
        if (interval > 1) {
            return interval + "h";
        }
        interval = Math.floor(seconds / 60);
        console.log('interval: ' + interval);
        if (interval >= 1) {
            return interval + "m";
        }

        if(seconds >= 0 && seconds < 30 || seconds <= -1) {
            return 'now';
        }
        else {
            return Math.floor(seconds) + "s";
        }
    }
}

/*
function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}
var aDay = 24*60*60*1000
console.log(timeSince(new Date(Date.now()-aDay)));
console.log(timeSince(new Date(Date.now()-aDay*2)));
    */