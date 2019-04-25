import { Injectable, Component } from '@angular/core';
import { HttpClientService, BaseDataService, SystemService } from '../../../core/providers';

import { Subject } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';
@Injectable()
export class IncomeService {

    public editEvent = new Subject<object>();

    public changeListByDateEvent = new Subject();

    public income: any;

    public incomeList = [];

    public groupIncomeList = [];

    public incomeListDate = moment().format('YYYY-MM');

    public totalMonthAmount = 0;
    constructor(
        public http: HttpClientService,
        public baseDataService: BaseDataService,
        public system: SystemService
    ) { }

    edit(value: object) {
        this.editEvent.next(value);
    }

    changeListBydate() {
        this.changeListByDateEvent.next();
    }

    changeIncome(item) {
        const incomeCategory = this.baseDataService.getIncomeCategory(item.incomeCategoryId);

        item.incomeCategoryName = incomeCategory.name;

        const address = this.baseDataService.getAddress(item.addressId);

        item.addressName = address.city;

        const fundParty = this.baseDataService.getFundParty(item.fundPartyId);
        item.fundPartyName = fundParty.name;

        const fundChannel = this.baseDataService.getFundChannel(item.fundChannelId);
        item.fundChannelName = fundChannel.name;

        this.incomeList.push(item);
    }

    groupDetailList() {
        this.groupIncomeList = [];
        const group = _.groupBy(this.incomeList, 'incomeCategoryName');
        for (const item in group) {
            this.groupIncomeList.push({
                name: item,
                list: group[item]
            });
        }
    }

    async add(participantList, labelList) {
        try {
            const incomeData = {
                income: this.income,
                participantList: participantList,
                labelList: labelList
            };
            const data: any = await this.http.post('/DR/addIncome', incomeData);

            const fundAccount = this.baseDataService.getFundAccount(this.income.fundAccountId);

            fundAccount.amount = (fundAccount.amount * 100 + this.income.amount * 100) / 100;

            this.totalMonthAmount = (this.totalMonthAmount * 100 + this.income.amount * 100) / 100;

            this.changeListBydate();
        } catch (error) {
            throw error;
        }
    }


    async editIncome(participantList, labelList) {
        try {
            const incomeData = {
                income: this.income,
                participantList: participantList,
                labelList: labelList
            };

            const incomeId: any = await this.http.post('/DR/editIncome', incomeData);

            this.incomeListDate = moment(this.income.endDate).format('YYYY-MM');

            const oldIncome = _.find(this.incomeList, { id: this.income.id });

            const diffAmount = (this.income.amount * 100 - oldIncome.amount * 100) / 100;

            const fundAccount = this.baseDataService.getFundAccount(this.income.fundAccountId);

            fundAccount.balance = (fundAccount.balance * 100 + diffAmount * 100) / 100;

            this.changeListBydate();
        } catch (error) {
            throw error;
        }
    }


    async deleteIncome(incomeId, fundAccountId) {
        try {
            await this.http.get('/DR/deleteIncome?id=' + incomeId);
            const fundAccount = this.baseDataService.getFundAccount(fundAccountId);

            fundAccount.amount = (fundAccount.amount * 100 - this.income.amount * 100) / 100;

            this.changeListBydate();
        } catch (error) {
            throw error;
        }
    }
}
