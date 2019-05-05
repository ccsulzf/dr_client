import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable()
export class SystemService {

    public temp: any;

    // 选择的公共
    public showListEvent = new Subject<any>();

    // 公共的编辑
    public doneEvent = new Subject<any>();

    // 动态组件
    public changeComponentEvent = new Subject<object>();

    // 重置
    public resetEvent = new Subject();


    public tabViewList = new Set();

    public changeTabViewEvent = new Subject<any>();

    public selectedTabView = null;
    done(value?) {
        this.doneEvent.next(value);
    }

    showList(data) {
        this.showListEvent.next(data);
    }

    changeComponent(value: object) {
        this.changeComponentEvent.next(value);
    }

    changeTabView(value) {
        // this.selectedTabView = value;
        this.changeTabViewEvent.next(value);
    }

    reset() {
        this.resetEvent.next();
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

