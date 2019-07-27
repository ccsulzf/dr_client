import { Injectable, Component } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable()
export class AccountService {

    public changeComponentEvent = new Subject<object>();

    // 如果切换了组件就保存上一个组件和要传递的值
    public rootComponent: any = {
        component: ''
    };

    constructor() { }

    changeComponent(value: object) {
        this.changeComponentEvent.next(value);
    }
}
