import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';

@Injectable()
export class UserInfoProvider {
    private user: any;

    constructor(private storage: Storage) {
        this.storage.get('user').then((value) => {
            this.user = JSON.parse(value);
        });
    }

    getUser() {
        return this.user;
    }

    getID() {
        return this.user.id;
    }
}
