import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../core/providers';
@Injectable()
export class LoginService {
    constructor(
        public http: HttpClientService
    ) { }

    async login(nameOrEmali, password) {
        return await this.http.post('/DR/login', { nameOrEmali: nameOrEmali, password: password });
    }
}