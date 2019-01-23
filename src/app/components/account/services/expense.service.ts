import { Injectable, Component } from '@angular/core';
import { HttpClientService, BaseDataService, SystemService } from '../../../core/providers';

import { Subject } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';
@Injectable()
export class ExpenseService {

    public editEvent = new Subject<object>();

    public totalDayAmount = 0;

    constructor(
        private http: HttpClientService,
        private baseDataService: BaseDataService,
        private system: SystemService
    ) { }

    public expenseList = [];

    public expenseDetailList = [];

    // public expense: any = {
    //     expenseDate: '',
    //     userId: '',
    //     expenseBookId: '',
    //     totalAmount: 0
    // };
    public expense: any;

    // public expenseDetail: any = {
    //     addressId: '',
    //     expenseCategoryId: '',
    //     fundPartyId: '',
    //     fundWayId: '',
    //     fundAccountId: '',
    //     content: '',
    //     amount: 0
    // };
    public expenseDetail: any;

    init() {
        // this.expense = {
        //     userId: '',
        //     expenseBookId: '',
        //     expenseDate: '',
        // };
        // this.expenseDetail = {
        //     addressId: '',
        //     content: '',
        //     amount: 0,
        //     memo: '',
        //     expenseCategoryId: '',
        //     fundPartyId: '',
        //     fundWayId: '',
        //     fundAccountId: ''
        // };
        this.expense = null;
        this.expenseDetail = null;
    }


    edit(value: object) {
        this.editEvent.next(value);
    }

    async addExpense(participantList, labelList) {
        try {

            const data = {
                expense: this.expense,
                expenseDetail: this.expenseDetail,
                participantList: participantList,
                labelList: labelList
            };

            const expenseId = await this.http.post('/DR/addExpense', data);

            const fundAccount = this.baseDataService.getFundAccount(this.expenseDetail.fundAccountId);

            fundAccount.balance = (fundAccount.balance * 100 - this.expenseDetail.amount * 100) / 100;

            const expense = _.find(this.expenseList, { expenseBookId: this.expense.expenseBookId });

            this.totalDayAmount += this.expenseDetail.amount;

            if (expense) {
                expense.totalAmount += this.expenseDetail.amount;
            } else {
                const expenseBook = this.baseDataService.getExpenseBook(this.expense.expenseBookId);
                this.expenseList.push({
                    id: expenseId,
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
