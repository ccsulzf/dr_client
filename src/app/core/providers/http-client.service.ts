import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { LogService } from './log.service';
import { API_CONFIG } from '../../app.config';

@Injectable()
export class HttpClientService {
    public httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(public http: HttpClient, public log: LogService) {
    }

    handleHost(url) {
        if (url && url.indexOf('http') < 0) {
            for (const api in API_CONFIG) {
                if (url.indexOf('/' + api) === 0) {
                    url = url.replace('/' + api, API_CONFIG[api]);
                    return url;
                }
            }
        }

        return url;
    }

    get(url) {
        return new Promise((resolve, reject) => {
            if (url.indexOf('?') >= 0) {
                url += '&_timestamp=' + new Date().getTime();
            } else {
                url += '?_timestamp=' + new Date().getTime();
            }
            url = this.handleHost(url);
            this.http.get(url).pipe(map(this.extractData))
                .subscribe((resData) => {
                    resolve(resData);
                }, (error) => {
                    this.log.error(url);
                    reject(this.handleError(error));
                });
        });
    }

    getFor(moduleName, modelName, option) {
        if (!moduleName || !modelName) {
            return null;
        }
        let param = '';
        if (option) {
            param = '?';
            for (const p in option) {
                param += p + '=' + option[p] + '&';
            }
        }
        return this.get('/' + moduleName + '/' + modelName + '/' + param);
    }

    post(url, data) {
        return new Promise((resolve, reject) => {
            url = this.handleHost(url);
            return this.http.post(url, data, this.httpOptions).pipe(map(this.extractData))
                .subscribe((resData) => {
                    resolve(resData);
                }, (error) => {
                    this.log.error(url);
                    reject(this.handleError(error));
                });
        });
    }

    postFor(moduleName, modelName, data) {
        if (!moduleName || !modelName || !data) {
            return null;
        }
        const url = '/' + moduleName + '/' + modelName;
        return this.post(url, data);
    }

    put(url, data) {
        return new Promise((resolve, reject) => {
            url = this.handleHost(url);
            return this.http.put(url, data, this.httpOptions).pipe(map(this.extractData))
                .subscribe((resData) => {
                    resolve(resData);
                }, (error) => {
                    this.log.error(url);
                    reject(this.handleError(error));
                });
        });
    }

    putFor(moduleName, modelName, data) {
        if (!moduleName || !modelName || !data || !data.id) {
            return null;
        }
        const url = '/' + moduleName + '/' + modelName + '/' + data.id;
        return this.put(url, data);
    }

    delete(url) {
        return new Promise((resolve, reject) => {
            url = this.handleHost(url);
            this.http.get(url).pipe(map(this.extractData))
                .subscribe((resData) => {
                    resolve(resData);
                }, (error) => {
                    this.log.error(url);
                    reject(this.handleError(error));
                });
        });
    }

    deleteFor(moduleName, option) {
        if (!moduleName || !option) {
            return null;
        }
        let param = '';
        if (option) {
            param = '?';
            for (const p in option) {
                param += p + '=' + option[p] + '&';
            }
        }
        return this.delete('/' + moduleName + '/' + param);
    }

    public extractData(body: any) {
        if (body.error && (body.error.code >= 500 || body.error.code === 404)) {
            throw body.error;
        }
        return body.data;
    }

    public handleError(error: HttpErrorResponse | any) {
        let errorMsg: string;
        if (error instanceof HttpErrorResponse) {
            if (!error.ok) {
                errorMsg = '无法连接到服务，网络异常';
            } else {
                errorMsg = `${error.status} - ${error.statusText || ''}`;
            }
        } else {
            errorMsg = error.message ? error.message : error.toString();
        }

        this.log.error(errorMsg);
        return errorMsg;
    }
}
