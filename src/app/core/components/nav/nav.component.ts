import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../providers';
import { Router } from '@angular/router';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  public user;
  constructor(
    private router: Router,
    private system: SystemService
  ) { }

  ngOnInit() {
    this.user = this.system.user;
  }

  toExpense() {
    this.router.navigateByUrl('/account/expense');
  }

  toIncome() {
    this.router.navigateByUrl('/account/income');
  }

  toExpenseDetail() {
    this.router.navigateByUrl('/report/expense-detail');
  }

  logout() {
    this.router.navigateByUrl('/dashboard');
    this.system.deleteUser();
  }

}
