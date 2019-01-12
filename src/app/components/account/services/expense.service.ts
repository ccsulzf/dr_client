import { Injectable, Component } from '@angular/core';
import { HttpClientService } from '../../../core/providers';
import { Subject } from 'rxjs';
@Injectable()
export class ExpenseService {

    constructor(
        private http: HttpClientService
    ) { }

    public expenseList = [];

    public expenseDetailList = [];

    public expense: any = {
        expenseDate: '',
        userId: '',
        expenseBookId: '',
        addressId: '',
        expenseCategoryId: '',
        fundPartyId: '',
        fundWayId: '',
        fundAccountId: ''
    };

    public expenseDetail: any = {
        content: '',
        amount: 0
    };

    init() {
        this.expense = {
            userId: '',
            expenseBookId: '',
            addressId: '',
            expenseCategoryId: '',
            fundPartyId: '',
            fundWayId: '',
            fundAccountId: ''
        };
        this.expenseDetail = {
            content: '',
            amount: 0,
            memo: ''
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
        } catch (error) {
            throw error;
        }
    }
}