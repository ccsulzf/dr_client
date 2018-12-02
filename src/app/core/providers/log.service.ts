import { Injectable } from '@angular/core';

let log4js: any;
if (window['require']) {
    const require = window['require'];
    log4js = require('log4js');
}

@Injectable()
export class LogService {
    loggerError;
    loggerDebug;
    loggerInfo;

    constructor() {
        if (log4js) {
            const path = window['require']('path');
            const fs = window['require']('fs');
            const process = window['process'];
            const log_path = path.join(process.env.USERPROFILE, '.as', 'logs');

            if (!fs.existsSync(log_path)) {
                fs.mkdirSync(log_path);
            }

            const config = {
                appenders: [{
                    type: 'file',
                    filename: 'out.log',
                    maxLogSize: 10485760,
                    pattern: '-yyyy-MM-dd',
                    numBackups: 5,
                    category: 'info'
                },
                {
                    type: 'file',
                    filename: 'debug.log',
                    maxLogSize: 10485760,
                    pattern: '-yyyy-MM-dd',
                    numBackups: 5,
                    category: 'debug'
                },
                {
                    type: 'file',
                    filename: 'error.log',
                    maxLogSize: 10485760,
                    pattern: '-yyyy-MM-dd',
                    numBackups: 5,
                    category: 'error'
                }
                ]
            };

            log4js.configure(config, {
                cwd: log_path
            });

            this.loggerError = log4js.getLogger('error');
            this.loggerDebug = log4js.getLogger('debug');
            this.loggerInfo = log4js.getLogger('info');
        } else {
            this.loggerError = this.loggerDebug = this.loggerInfo = window.console;
        }
    }

    error(value) {
        this.loggerError.error(value);
    }

    debug(value) {
        this.loggerDebug.debug(value);
    }

    info(value) {
        this.loggerInfo.info(value);
    }

    log(value) {
        this.loggerInfo.info(value);
    }
}
