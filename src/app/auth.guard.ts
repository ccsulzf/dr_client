import { Injectable } from '@angular/core';
import {
    CanActivate, Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild
} from '@angular/router';
import { BaseDataService, SystemService } from './core/providers';
@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        public baseDataService: BaseDataService,
        public system: SystemService
    ) { }
    async canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot) {
        if (this.system.user) {
            await this.baseDataService.getAllBaseData();
        }
        return true;
    }

}

