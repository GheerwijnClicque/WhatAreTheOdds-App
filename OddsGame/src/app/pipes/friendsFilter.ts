import { Injectable, Pipe } from '@angular/core';
import { Storage } from '@ionic/storage';

@Pipe({
    name: 'friendsFilter',
    pure: false
})
@Injectable()
export class FriendsFilter {
    private user: any;

    constructor(private storage: Storage) {
        this.storage.get('user').then((user) => {
            this.user = JSON.parse(user);
        });
    }

    transform(value) {
        console.log(value);
        console.log(this.user);
    
       
       /* var wtf = value.filter(function(wut) {
            return wut;
        });

        return wtf;
      /*  value.filter((obj) => {
                    console.log(obj)

            return obj;
        });*/
        //return value;
      /*  return value.filter((obj) => {
            if(obj.facebook_id === parseInt(this.user.id)) {
                return obj;
            }
        }); */
    }
}

