import { Injectable, Component } from '@angular/core';
import { HttpClientService, BaseDataService, SystemService, BaseData } from '../../../core/providers';

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

    async add(income, participantList, labelList) {
        try {
            const incomeData = {
                income: income,
                participantList: participantList,
                labelList: labelList
            };
            const addIncome = await this.http.post('/DR/addIncome', incomeData);

            BaseData.fundAccountList = <any>await this.http.get('/DR/getFundCount?userId=' + this.system.user.id);

            this.totalMonthAmount = (this.totalMonthAmount * 100 + income.amount * 100) / 100;

            this.changeIncome(addIncome);
            this.groupDetailList();
        } catch (error) {
            throw error;
        }
    }


    async editIncome(income, participantList, labelList) {
        try {
            const incomeData = {
                income: income,
                participantList: participantList,
                labelList: labelList
            };
            const incomeId: any = await this.http.post('/DR/editIncome', incomeData);

            this.incomeListDate = moment(this.income.endDate).format('YYYY-MM');

            let oldIncome = _.find(this.incomeList, { id: this.income.id });

            BaseData.fundAccountList = <any>await this.http.get('/DR/getFundCount?userId=' + this.system.user.id);

            this.totalMonthAmount = (this.totalMonthAmount * 100 + income.amount * 100 - oldIncome.amount * 100) / 100;

            oldIncome = Object.assign(oldIncome, income);

            this.groupDetailList();

        } catch (error) {
            throw error;
        }
    }


    async deleteIncome(incomeId) {
        try {
            await this.http.get('/DR/deleteIncome?id=' + incomeId);

            BaseData.fundAccountList = <any>await this.http.get('/DR/getFundCount?userId=' + this.system.user.id);
            _.remove(this.incomeList, { id: incomeId });
            this.groupDetailList();
        } catch (error) {
            throw error;
        }
    }
}
