import { Injectable } from '@angular/core';

@Injectable()
export class SystemService {
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