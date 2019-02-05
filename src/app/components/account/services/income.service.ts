import { Injectable, Component } from '@angular/core';
import { HttpClientService, BaseDataService, SystemService } from '../../../core/providers';

import { Subject } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';
@Injectable()
export class IncomeService {

    public editEvent = new Subject<object>();

    public income: any;

    public incomeList = [];

    public groupIncomeList = [];

    public incomeListDate = moment().format('YYYY-MM-DD');

    public totalMonthAmount;
    constructor(
        private http: HttpClientService,
        private baseDataService: BaseDataService,
        private system: SystemService
    ) { }

    edit(value: object) {
        this.editEvent.next(value);
    }

    changeIncome(item) {
        const incomeCategory = this.baseDataService.getIncomeCategory(item.incomeCategoryId);

        item.incomeCategoryName = incomeCategory.name;

        const address = this.baseDataService.getAddress(item.addressId);

        item.addressName = address.city;

        const fundParty = this.baseDataService.getFundParty(item.fundPartyId);
        item.fundPartyName = fundParty.name;

        const fundWay = this.baseDataService.getFundWay(item.fundWayId);
        item.fundWayName = fundWay.name;

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

        console.info(this.groupIncomeList);
    }

    async add(participantList, labelList) {
        try {
            const incomeData = {
                income: this.income,
                participantList: participantList,
                labelList: labelList
            }
            const data: any = await this.http.post('/DR/addIncome', incomeData);

            const fundAccount = this.baseDataService.getFundAccount(this.income.fundAccountId);

            fundAccount.amount = (fundAccount.amount * 100 + this.income.amount * 100) / 100;

            this.totalMonthAmount = (this.totalMonthAmount * 100 + this.income.amount * 100) / 100;

            this.income.id = data;
            this.changeIncome(this.income);
            this.groupDetailList();
        } catch (error) {
            throw error;
        }
    }
}