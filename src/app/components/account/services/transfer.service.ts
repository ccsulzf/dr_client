import { Injectable, Component } from '@angular/core';
import { HttpClientService, BaseDataService, SystemService, BaseData } from '../../../core/providers';

import { Subject } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';
@Injectable()
export class TransferService {
    public editEvent = new Subject<object>();

    public changeListByDateEvent = new Subject();

    public transferListDate = moment().format('YYYY-MM');

    public transferList = [];
    constructor(
        public http: HttpClientService,
        public baseDataService: BaseDataService,
        public system: SystemService
    ) { }

    changeTransfer(item) {
        const outFundAccount = this.baseDataService.getFundAccount(item.outFundAccountId);
        item.outFundAccountName = outFundAccount.name;

        const inFundAccount = this.baseDataService.getFundAccount(item.inFundAccountId);
        item.inFundAccountName = inFundAccount.name;

        this.transferList.push(item);
    }


    async add(transfer, labelList) {
        try {
            const transferData = {
                transfer: transfer,
                labelList: labelList
            };
            const addTransfer = await this.http.post('/DR/addTransfer', transferData);
            BaseData.fundAccountList = <any>await this.http.get('/DR/getFundCount?userId=' + this.system.user.id);
            console.info(addTransfer);
        } catch (error) {
            throw error;
        }
    }
}
