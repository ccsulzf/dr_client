import { Injectable } from '@angular/core';
import { HttpClientService, SystemService } from '../../../core/providers';
@Injectable()
export class LoginService {
    constructor(
        public http: HttpClientService,
        public system: SystemService
    ) { }

    async login(nameOrEmali, password) {
        let user = await this.http.post('/DR/login', { nameOrEmali: nameOrEmali, password: password });

        if (user) {
            this.system.user = user;
            return true;
        }
        return false;
    }
}