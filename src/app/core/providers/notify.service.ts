import { Injectable } from '@angular/core';
@Injectable()
export class NotifyService {
    constructor(
    ) { }

    // 消息类型,消息内容,过几秒自动消失
    // type:success info warning error
    notify(message, type = 'info', duration = 2000) {
        const body = document.body;

        const div = this.setDiv(type);

        this.setButton(div);

        this.setIcon(type, div);

        const span = document.createElement('span');
        span.style.marginLeft = '10px';
        span.style.fontSize = '0.7rem';
        span.innerText = message;

        div.appendChild(span);
        body.appendChild(div);

        setTimeout(() => {
            const element = document.getElementsByClassName('glabal-notify');
            document.body.removeChild(element[0]);
        }, duration);
    }

    setButton(div) {
        const button = document.createElement('button');
        button.className = 'btn btn-clear float-right';
        button.onclick = function () {
            const element = document.getElementsByClassName('glabal-notify');
            document.body.removeChild(element[0]);
        };
        div.appendChild(button);
    }


    setDiv(type) {
        const div = document.createElement('div');
        switch (type) {
            case 'success':
                div.className = 'toast toast-success glabal-notify';
                break;
            case 'warning':
                div.className = 'toast toast-warning glabal-notify';
                break;
            case 'info':
                div.className = 'toast toast-primary glabal-notify';
                break;
            case 'error':
                div.className = 'toast toast-error glabal-notify';
                break;
            default:
                break;
        }
        return div;
    }

    setIcon(type, div) {
        const icon = document.createElement('span');
        icon.className = 'glabal-notify-icon';
        const info = document.createElement('i');
        switch (type) {
            case 'success':
                info.className = 'fa fa-check';
                break;
            case 'warning':
                icon.className = '';
                info.className = 'fa fa-warning';
                break;
            case 'info':
                info.className = 'fa fa-info';
                break;
            case 'error':
                info.className = 'fa fa-close';
                break;
            default:
                break;
        }
        icon.appendChild(info);
        div.appendChild(icon);
    }
}
