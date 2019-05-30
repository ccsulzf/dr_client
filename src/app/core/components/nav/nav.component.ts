import { Component, OnInit } from '@angular/core';
import { SystemService } from '../../providers';
import { Router, ActivatedRoute, Route } from '@angular/router';
import { NAV_CONFIG } from './config';
import { remote } from 'electron';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  public user;

  public NAV_CONFIG = NAV_CONFIG;
  public currentUrl;

  public selectedItem;
  public selectedSubItem;
  constructor(
    public router: Router,
    public system: SystemService,
  ) { }

  ngOnInit() {
    this.currentUrl = this.router.url;
    this.user = this.system.user;
    for (let item of this.NAV_CONFIG) {
      if (item.path) {
        if (item.path === this.currentUrl) {
          this.selectedItem = item;
          break;
        }
      }
      for (let subItem of item.subList) {
        if (subItem.path === this.currentUrl) {
          this.selectedItem = item;
          this.selectedSubItem = subItem;
          break;
        }
      }
    }
  }

  min() {
    const window = remote.getCurrentWindow();
    window.minimize();
  }

  close() {
    const window = remote.getCurrentWindow();
    window.close();
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

  clickItem(item) {
    this.selectedItem = item;
    if (item.path) {
      this.router.navigateByUrl(item.path);
    }
  }

  clickSubItem(item, subItem, event) {
    event.stopPropagation();
    this.selectedItem = item;
    this.selectedSubItem = subItem;
    this.router.navigateByUrl(subItem.path);
  }


}
