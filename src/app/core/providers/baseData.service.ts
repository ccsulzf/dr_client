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

        this.http.get('/DR/Participant?userId=' + this.system.user.id).then((value: any) => {
            BaseData.participantList = value;
        });

        this.http.get('/DR/Label?userId=' + this.system.user.id).then((value: any) => {
            BaseData.labelList = value;
        });

        this.http.get('/DR/ExpenseCategory?userId=' + this.system.user.id).then((value: any) => {
            BaseData.expenseCategoryList = value;
        });

        this.http.get('/DR/IncomeCategory?userId=' + this.system.user.id).then((value: any) => {
            BaseData.incomeCategoryList = value;
        });
    }

    public addLable(item) {
        BaseData.labelList.push(item);
    }

    public getLabel(id) {
        return _.find(BaseData.labelList, { id: id });
    }

    public deleteLabel(item) {
        _.remove(BaseData.labelList, item);
    }

    public addParticipant(item) {
        BaseData.participantList.push(item);
    }

    public getParticipant(id) {
        return _.find(BaseData.participantList, { id: id });
    }

    public addFundAccount(item) {
        BaseData.fundAccountList.push(item);
    }

    public getFundAccount(id) {
        return _.find(BaseData.fundAccountList, { id: id });
    }

    public addFundWay(item) {
        BaseData.fundWayList.push(item);
    }

    public getFundWay(id) {
        return _.find(BaseData.fundWayList, { id: id });
    }

    public addFundParty(item) {
        BaseData.fundPartyList.push(item);
    }

    public getFundParty(id) {
        return _.find(BaseData.fundPartyList, { id: id });
    }


    public getExpenseCategoryList() {
        return BaseData.expenseCategoryList;
    }

    public addExpenseCategory(item) {
        BaseData.expenseCategoryList.push(item);
    }

    public getExpenseCategory(id) {
        return _.find(BaseData.expenseCategoryList, { id: id });
    }

    public addIncomeCategory(item) {
        BaseData.incomeCategoryList.push(item);
    }

    public getIncomeCategory(id) {
        return _.find(BaseData.incomeCategoryList, { id: id });
    }
    getAddressList() {
        return BaseData.addressList;
    }

    getAddress(id) {
        return _.find(BaseData.addressList, { id: id });
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
        return _.find(BaseData.expenseBookList, { id: id });
    }

    addExpenseBook(item) {
        BaseData.expenseBookList.push(item);
    }

    updateExpenseBook() {

    }

    delExpenseBook() {

    }

}
