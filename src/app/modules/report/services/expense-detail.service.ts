import { Injectable } from '@angular/core';
import { HttpClientService, BaseDataService } from '../../../core/providers';
import * as moment from 'moment';
@Injectable()
export class ExpenseDetailService {
    constructor(
        public http: HttpClientService,
        public baseDataService: BaseDataService
    ) {

    }

    changeData(list) {
        for (let item of list) {

            item.expenseDate = moment(item.expenseDate).format('YYYY-MM-DD')

            const address = this.baseDataService.getAddress(item.addressId);
            item.addressName = address.province + '|' + address.city + '|' + address.area;

            const expenseBook = this.baseDataService.getExpenseBook(item.expenseBookId);
            item.expenseBookName = expenseBook.name;

            const expenseCategory = this.baseDataService.getExpenseCategory(item.expenseCategoryId);
            item.expenseCategoryName = expenseCategory.name;

            const fundAccount = this.baseDataService.getFundAccount(item.fundAccountId);
            item.fundAccountName = fundAccount.name;

            const fundChannel = this.baseDataService.getFundChannel(item.fundChannelId);
            item.fundChannelName = fundChannel.name;

            const fundParty = this.baseDataService.getFundParty(item.fundPartyId);
            item.fundPartyName = fundParty.name;

        }
    }

    async getData(options) {
        try {
            const list: any = await this.http.post('/DR/getExpenseReportDetail', options);
            if (list && list.length) {
                this.changeData(list);
                return list;
            } else {
                return [];
            }
        } catch (error) {
            throw error;
        }
    }
}