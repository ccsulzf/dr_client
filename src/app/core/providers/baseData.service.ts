import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { SystemService } from './system.service';
import { BaseData } from './base-data';
import * as _ from 'lodash';
@Injectable()
export class BaseDataService {

    constructor(
        public http: HttpClientService,
        public system: SystemService,
    ) { }

    async getAllBaseData() {
        this.http.get('/DR/ExpenseBook?userId=' + this.system.user.id).then((value: any) => {
            BaseData.expenseBookList = value;
        });

        this.http.get('/DR/Address?userId=' + this.system.user.id).then((value: any) => {
            BaseData.addressList = value;
        });

        this.http.get('/DR/FundParty?userId=' + this.system.user.id).then((value: any) => {
            BaseData.fundPartyList = value;
        });

        this.http.get('/DR/FundWay?userId=' + this.system.user.id).then((value: any) => {
            BaseData.fundWayList = value;
        });

        this.http.get('/DR/getFundCount?userId=' + this.system.user.id).then((value: any) => {
            BaseData.fundAccountList = value;
        });
    }

    public addFundAccount(item) {
        BaseData.fundAccountList.push(item);
    }

    public addFundWay(item) {
        BaseData.fundWayList.push(item);
    }

    public addFundParty(item) {
        BaseData.fundPartyList.push(item);
    }

    public getExpenseCategoryList() {
        return BaseData.expenseCategoryList;
    }

    public addExpenseCategory(item) {
        BaseData.expenseCategoryList.push(item);
    }

    getAddressList() {
        return BaseData.addressList;
    }

    getAddress(id) {

    }

    addAddress(item) {
        BaseData.addressList.push(item);
    }

    updateAddress() {

    }

    delAddress() {

    }

    getExpenseBookList() {
        return BaseData.expenseBookList;
    }

    getExpenseBook(id) {

    }

    addExpenseBook(item) {
        BaseData.expenseBookList.push(item);
    }

    updateExpenseBook() {

    }

    delExpenseBook() {

    }

}
