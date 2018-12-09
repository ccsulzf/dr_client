import { Component, OnInit } from '@angular/core';
import { SystemService, HttpClientService, BaseDataService } from '../../../providers';
@Component({
  selector: 'app-expense-book-add-edit',
  templateUrl: './expense-book-add-edit.component.html',
  styleUrls: ['./expense-book-add-edit.component.scss']
})
export class ExpenseBookAddEditComponent implements OnInit {
  public name = '';
  public memo = '';
  constructor(
    public system: SystemService,
    public http: HttpClientService,
    public baseData: BaseDataService
  ) { }

  ngOnInit() {
  }

  async add() {
    // console.info(this.system.user);
    const expenseBook = await this.http.post('/DR/ExpenseBook', { name: this.name, memo: this.memo, userId: this.system.user.id });
    if (expenseBook) {
      console.info(expenseBook);
      this.baseData.addExpenseBook(expenseBook);
      this.system.done();
    }
  }

  cancel() {
    this.system.done();
  }

}
