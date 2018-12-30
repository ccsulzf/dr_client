import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services';
@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit {

  constructor(
    private accountService: AccountService
  ) { }

  ngOnInit() {
  }

  toDetailList() {
    this.accountService.changeComponent({ component: 'expense-detail' });
  }

}
