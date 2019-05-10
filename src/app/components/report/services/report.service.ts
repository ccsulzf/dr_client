import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
@Injectable()
export class ReportService {


    // public reportOption = {
    //     dateTime: {
    //         type: '',
    //         start: '',
    //         end: ''
    //     },
    //     conditions: [],
    //     pagination: {}
    // };

    public dateTime = {
        type: '',
        startDate: '',
        endDate: ''
    };

    public conditions = [];

    public pagination = [];

    public getFilterEvent = new Subject<any>();

    public removeSelectEvent = new Subject<string>();

    public removeSelect(value) {
        this.removeSelectEvent.next(value);
    }

    public getFilter() {
        this.getFilterEvent.next();
    }
}
