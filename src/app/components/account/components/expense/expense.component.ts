import {
  Component, OnInit, ViewChild, ComponentFactoryResolver,
  OnDestroy, AfterViewInit, AfterViewChecked, ChangeDetectorRef
} from '@angular/core';
import { DynamicComponentDirective } from '../../../../core/directives';
import { SystemService } from '../../../../core/providers';
import {
  AddressAddEditComponent, ExpenseBookAddEditComponent,
  ExpenseCategoryAddEditComponent, FundPartyAddEditComponent,
  FundAccountAddEditComponent, ParticipantAddEditComponent,
  FundChannelAddEditComponent
} from '../../../../core/components';
import { ExpenseListComponent, ExpenseDetailComponent } from '../expense';
import { AccountService } from '../../services';
@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnDestroy, AfterViewInit, AfterViewChecked {
  @ViewChild(DynamicComponentDirective) dynamic: DynamicComponentDirective;
  public changeComponent;
  public done;
  constructor(
    public componentFactoryResolver: ComponentFactoryResolver,
    public accountService: AccountService,
    public system: SystemService,
    public cd: ChangeDetectorRef
  ) { }

  ngAfterViewInit() {
    this.accountService.rootComponent.component = ExpenseListComponent;
    this.accountService.rootComponent.data = '';
    this.dynamicLoad(ExpenseListComponent);
    this.done = this.system.doneEvent.subscribe(() => {
      this.dynamicLoad(this.accountService.rootComponent.component, this.accountService.rootComponent.data);
    });

    this.changeComponent = this.system.changeComponentEvent.subscribe((value: any) => {
      switch (value.component) {
        case 'expenseBook-add-edit':
          this.dynamicLoad(ExpenseBookAddEditComponent);
          break;
        case 'address-add-edit':
          this.dynamicLoad(AddressAddEditComponent);
          break;
        case 'expenseCategory-add-edit':
          this.dynamicLoad(ExpenseCategoryAddEditComponent, value.data);
          break;
        case 'fundParty-add-edit':
          this.dynamicLoad(FundPartyAddEditComponent, value.data);
          break;
        case 'fundChannel-add-edit':
          this.dynamicLoad(FundChannelAddEditComponent);
          break;
        case 'fundAccount-add-edit':
          this.dynamicLoad(FundAccountAddEditComponent, value.data);
          break;
        case 'participant-add-edit':
          this.dynamicLoad(ParticipantAddEditComponent);
          break;
        case 'expense-detail':
          this.dynamicLoad(ExpenseDetailComponent, value.data);
          break;
        case 'expense-list':
          this.dynamicLoad(ExpenseListComponent);
          break;
        default:
          break;
      }
    });
  }

  ngAfterViewChecked() {
    this.cd.detectChanges();
  }

  dynamicLoad(component?, data?) {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const viewContainerRef = this.dynamic.viewContainerRef;

    viewContainerRef.clear();
    const componentRef: any = viewContainerRef.createComponent(componentFactory);
    if (data) {
      componentRef.instance.data = data;
    }
  }

  removeDynamicComponet() {
    const viewContainerRef = this.dynamic.viewContainerRef;
    viewContainerRef.clear();
  }

  ngOnDestroy() {
    this.removeDynamicComponet();
    if (this.changeComponent) {
      this.changeComponent.unsubscribe();
    }
    if (this.done) {
      this.done.unsubscribe();
    }
  }
}
