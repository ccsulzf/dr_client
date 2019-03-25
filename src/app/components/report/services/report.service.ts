import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as _ from 'lodash';
@Injectable()
export class ReportService {
    public reportOption = {
        dateTime: {
            type: '',
            start: '',
            end: ''
        },
        conditions: [],
        pagination: {}
    };

    public removeSelectEvent = new Subject<string>();

    public removeSelect(value) {
        this.removeSelectEvent.next(value);
    }

    changeEqualConditions(field, list, type) {
        let findCondition = _.find(this.reportOption.conditions, { field: field + 'Id' });
        if (findCondition) {
            if (list && list.length) {
                findCondition.value = _.map(list, 'id');
            } else {
                _.remove(this.reportOption.conditions, { field: field });
            }
        } else {
            this.reportOption.conditions.push({
                field: field + 'Id',
                type: type,
                value: _.map(list, 'id')
            });
        }
    }

    removeConditions(field, type) {
        switch (type) {
            case 'equal':
                _.remove(this.reportOption.conditions, { field: field + 'Id' });
                break;
            default:
                break;
        }
    }
}