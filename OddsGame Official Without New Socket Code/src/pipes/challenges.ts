import { Injectable, Pipe } from '@angular/core';
import { Storage } from '@ionic/storage';

@Pipe({
    name: 'ChallengesPipe',
    pure: false
})
@Injectable()
export class ChallengesPipe {
    user: any;

    constructor(private storage: Storage) {
        this.storage.get('user').then((user) => {
            this.user = user;
        });
    }

    transform(value, args) {
        return value.filter((obj) => {
            if(obj.accepted === args[0]) {
                if(obj.challengee_id === parseInt(JSON.parse(this.user).id)) {
                    return obj['display'] = obj.challenger_name + ' challenged you';
                }
                else {
                    return obj['display'] = 'You challenged ' + obj.challengee_name;
                }
            }
        });
    }
}