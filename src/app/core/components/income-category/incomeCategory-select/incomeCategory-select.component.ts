import { Component, OnInit, Input } from '@angular/core';
import { SystemService } from '../../../providers';
@Component({
  selector: 'incomeCategory-select',
  templateUrl: './incomeCategory-select.component.html',
  styleUrls: ['./incomeCategory-select.component.scss']
})
export class IncomeCategorySelectComponent implements OnInit {

  @Input() title;

  incomeCategoryItem;
  incomeCategory;

  showListEvent;

  isListShow = false;

  clickId = 'incomeCategory-list';

  constructor(
    private system: SystemService
  ) { }

  ngOnInit() {
    this.showListEvent = this.system.showListEvent.subscribe((data) => {
      if (this.clickId == data.id) {
        this.isListShow = !this.isListShow;
      } else {
        if (data.id) {
          this.isListShow = false;
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.showListEvent) {
      this.showListEvent.unsubscribe();
    }
  }

  // show() {
  //   this.isListShow = !this.isListShow;
  // }

}
