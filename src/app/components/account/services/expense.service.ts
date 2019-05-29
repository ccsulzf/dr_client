import { Injectable, Component } from '@angular/core';
import { HttpClientService, BaseDataService, SystemService, BaseData } from '../../../core/providers';

import { Subject } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';
@Injectable()
export class ExpenseService {

    public editEvent = new Subject<object>();

    public totalDayAmount = 0;

    public expneseListDate = moment().format('YYYY-MM-DD');

    public groupExpenseDetailList = [];
    constructor(
        public http: HttpClientService,
        public baseDataService: BaseDataService,
        public system: SystemService
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


    changeExpenseDetail(item) {
        const expenseCategory = this.baseDataService.getExpenseCategory(item.expenseCategoryId);
        item.expenseCategoryName = expenseCategory.name;

        const fundParty = this.baseDataService.getFundParty(item.fundPartyId);
        item.fundPartyName = fundParty.name;

        const fundChannel = this.baseDataService.getFundChannel(item.fundChannelId);
        item.fundChannelName = fundChannel.name;

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

    async addExpense(expense, expenseDetail, participantList, labelList) {
        try {
            const expenseData = {
                expense: expense,
                expenseDetail: expenseDetail,
                participantList: participantList,
                labelList: labelList
            };
            const data: any = await this.http.post('/DR/addExpense', expenseData);

            expense.id = data.expenseId;
            BaseData.fundAccountList = <any>await this.http.get('/DR/getFundCount?userId=' + this.system.user.id);

            // // 将id改成到具体的name,添加到ExpenseDetailList
            // this.changeExpenseDetail(data.expenseDetail);

            // // 将expenseDetailList进行分组
            // this.groupDetailList();

            this.totalDayAmount = (Number(this.totalDayAmount) * 100 + Number(expenseDetail.amount) * 100) / 100;
            const hasExpense = _.find(this.expenseList, (item) => {
                return +item.expenseBookId === +expense.expenseBookId;
            });
            if (hasExpense) {
                hasExpense.totalAmount = (Number(hasExpense.totalAmount) * 100 + Number(expenseDetail.amount) * 100) / 100;
                expense.totalAmount = hasExpense.totalAmount;
            } else {
                const expenseBook = this.baseDataService.getExpenseBook(expense.expenseBookId);
                this.expenseList.push({
                    id: data.expenseId,
                    expenseDate: moment().format('YYYY-MM-DD'),
                    userId: this.system.user.id,
                    expenseBookId: expense.expenseBookId,
                    expenseBookName: expenseBook.name,
                    totalAmount: expenseDetail.amount
                });
            }
        } catch (error) {
            throw error;
        }
    }

    async editExpense(expense, expenseDetail, participantList, labelList) {
        try {
            const data: any = await this.http.post('/DR/editExpense', {
                expense: expense,
                expenseDetail: expenseDetail,
                participantList: participantList,
                labelList: labelList
            });
            BaseData.fundAccountList = <any>await this.http.get('/DR/getFundCount?userId=' + this.system.user.id);

            expense = data.expense;

            // const prevFundAccount = this.baseDataService.getFundAccount(prevExpenseDetail.fundAccountId);
            // const nowFundAccount = this.baseDataService.getFundAccount(expenseDetail.fundAccountId);

            // prevFundAccount.balance = (Number(prevFundAccount.balance) * 100 + Number(prevExpenseDetail.amount) * 100) / 100;

            // nowFundAccount.balance = (Number(nowFundAccount.balance) * 100 - Number(expenseDetail.amount) * 100) / 100;


            // console.info(BaseData.fundAccountList);

        } catch (error) {
            throw error;
        }
    }


    async deleteExpenseDetail(expense, expenseDetailId, amount) {
        try {
            await this.http.delete('/DR/delExpense?expenseDetailId=' + expenseDetailId);
            BaseData.fundAccountList = <any>await this.http.get('/DR/getFundCount?userId=' + this.system.user.id);
            // const fundAccount = this.baseDataService.getFundAccount(this.expenseDetail.fundAccountId);
            // fundAccount.balance = (Number(fundAccount.balance) * 100 + Number(this.expenseDetail.amount) * 100) / 100;
            this.totalDayAmount = (Number(this.totalDayAmount) * 100 - Number(amount) * 100) / 100;
            expense.totalAmount = (Number(expense.totalAmount) * 100 - Number(amount) * 100) / 100;
        } catch (error) {
            throw error;
        }
    }
}
