import { Component, OnInit, Input } from '@angular/core';
import { SystemService, HttpClientService, BaseDataService } from '../../../providers';
@Component({
  selector: 'app-expense-book-add-edit',
  templateUrl: './expense-book-add-edit.component.html',
  styleUrls: ['../../core-form.scss']
})
export class ExpenseBookAddEditComponent implements OnInit {
  @Input() data;

  public expenseBook = {
    name: '',
    memo: '',
    userId: this.system.user.id
  }
  constructor(
    public system: SystemService,
    public http: HttpClientService,
    public baseData: BaseDataService
  ) { }

  ngOnInit() {
    if (this.data) {
      this.expenseBook = this.data;
    }
  }

  async addOrEdit() {
    const expenseBook = await this.http.post('/DR/ExpenseBook', this.expenseBook);
    if (expenseBook) {
      this.baseData.addExpenseBook(expenseBook);
      this.system.done({ model: 'expenseBook', data: expenseBook });
    }
  }

  cancel() {
    this.system.done();
  }

}
