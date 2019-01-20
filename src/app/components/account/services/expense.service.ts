import { Injectable, Component } from '@angular/core';
import { HttpClientService, BaseDataService, SystemService } from '../../../core/providers';
import * as moment from 'moment';
import * as _ from 'lodash';
@Injectable()
export class ExpenseService {

    constructor(
        private http: HttpClientService,
        private baseDataService: BaseDataService,
        private system: SystemService
    ) { }

    public expenseList = [];

    public expenseDetailList = [];

    public expense: any = {
        expenseDate: '',
        userId: '',
        expenseBookId: '',
        totalAmount: 0
    };

    public expenseDetail: any = {
        addressId: '',
        expenseCategoryId: '',
        fundPartyId: '',
        fundWayId: '',
        fundAccountId: '',
        content: '',
        amount: 0
    };

    init() {
        this.expense = {
            userId: '',
            expenseBookId: '',
            expenseDate: '',
        };
        this.expenseDetail = {
            addressId: '',
            content: '',
            amount: 0,
            memo: '',
            expenseCategoryId: '',
            fundPartyId: '',
            fundWayId: '',
            fundAccountId: ''
        };
    }

    async addExpense(participantList, labelList) {
        try {
            const data = {
                expense: this.expense,
                expenseDetail: this.expenseDetail,
                participantList: participantList,
                labelList: labelList
            };
            await this.http.post('/DR/addExpense', data);

            let expense = _.find(this.expenseList, { expenseBookId: this.expense.expenseBookId });
            if (expense) {
                expense.totalAmount += this.expenseDetail.amount;
            } else {
                const expenseBook = this.baseDataService.getExpenseBook(this.expense.expenseBookId);
                this.expenseList.push({
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


}