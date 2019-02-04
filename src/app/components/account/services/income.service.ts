import { Injectable, Component } from '@angular/core';
import { HttpClientService, BaseDataService, SystemService } from '../../../core/providers';

import { Subject } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';
@Injectable()
export class IncomeService {

    public income: any;

    constructor(
        private http: HttpClientService,
        private baseDataService: BaseDataService,
        private system: SystemService
    ) { }

    async add(participantList, labelList) {
        try {
            const incomeData = {
                income: this.income,
                participantList: participantList,
                labelList: labelList
            }
            const data: any = await this.http.post('/DR/addIncome', incomeData);

        } catch (error) {
            throw error;
        }
    }
}