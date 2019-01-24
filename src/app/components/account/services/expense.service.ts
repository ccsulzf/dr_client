import { Injectable, Component } from '@angular/core';
import { HttpClientService, BaseDataService, SystemService } from '../../../core/providers';

import { Subject } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';
@Injectable()
export class ExpenseService {

    public editEvent = new Subject<object>();

    public changeDateEvent = new Subject<string>();

    public totalDayAmount = 0;

    public expneseListDate = moment().format('YYYY-MM-DD');

    public groupExpenseDetailList = [];
    constructor(
        private http: HttpClientService,
        private baseDataService: BaseDataService,
        private system: SystemService
    ) { }

    public expenseList = [];

    public expenseDetailList = [];

    public expense: any;

    public expenseDetail: any;

    init() {
        this.expense = null;
        this.expenseDetail = null;
    }

    edit(value: object) {
        this.editEvent.next(value);
    }

    changeDate(value: string) {
        this.changeDateEvent.next(value);
    }

    changeExpenseDetail(item) {
        const expenseCategory = this.baseDataService.getExpenseCategory(item.expenseCategoryId);
        item.expenseCategoryName = expenseCategory.name;

        const fundParty = this.baseDataService.getFundParty(item.fundPartyId);
        item.fundPartyName = fundParty.name;

        const fundWay = this.baseDataService.getFundWay(item.fundWayId);
        item.fundWayName = fundWay.name;

        this.expenseDetailList.push(item);
    }

    groupDetailList() {
        this.groupExpenseDetailList = [];
        const group = _.groupBy(this.expenseDetailList, 'expenseCategoryName');

        for (const item in group) {
            this.groupExpenseDetailList.push({
                name: item,
                list: group[item]
            });
        }
    }

    async addExpense(participantList, labelList) {
        try {
            const expenseData = {
                expense: this.expense,
                expenseDetail: this.expenseDetail,
                participantList: participantList,
                labelList: labelList
            };

            const data: any = await this.http.post('/DR/addExpense', expenseData);

            this.changeExpenseDetail(data.expenseDetail);

            this.groupDetailList();

            const fundAccount = this.baseDataService.getFundAccount(this.expenseDetail.fundAccountId);

            fundAccount.balance = (fundAccount.balance * 100 - this.expenseDetail.amount * 100) / 100;

            const expense = _.find(this.expenseList, { expenseBookId: this.expense.expenseBookId });

            this.totalDayAmount += this.expenseDetail.amount;

            if (expense) {
                expense.totalAmount += this.expenseDetail.amount;
            } else {
                const expenseBook = this.baseDataService.getExpenseBook(this.expense.expenseBookId);
                this.expenseList.push({
                    id: data.expenseId,
                    expenseDate: moment().format('YYYY-MM-DD'),
                    userId: this.system.user.id,
                    expenseBookId: this.expense.expenseBookId,
                    expenseBookName: expenseBook.name,
                    totalAmount: this.expenseDetail.amount
                });
            }
        } catch (error) {
            throw error;
        }
    }

    async editExpense(participantList, labelList) {
        try {
            const data = {
                expense: this.expense,
                expenseDetail: this.expenseDetail,
                participantList: participantList,
                labelList: labelList
            };
            await this.http.post('/DR/editExpense', data);
        } catch (error) {
            throw error;
        }
    }
}
