import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable()
export class SystemService {
    public doneEvent = new Subject<any>();

    done(value?) {
        this.doneEvent.next(value);
    }

    set user(value) {
        localStorage.setItem('user', JSON.stringify(value));
    }

    get user() {
        return JSON.parse(localStorage.getItem('user'));
    }

    public deleteUser() {
        localStorage.removeItem('user');
    }
}

