import {
  Component, OnInit, ViewChild, ComponentFactoryResolver,
  OnDestroy, AfterViewInit, AfterViewChecked, ChangeDetectorRef
} from '@angular/core';
import { DynamicComponentDirective } from '../../../../core/directives';
import { SystemService } from '../../../../core/providers';
import {
  AddressAddEditComponent,
  FundPartyAddEditComponent,
  FundAccountAddEditComponent, ParticipantAddEditComponent, IncomeCategoryAddEditComponent, FundChannelAddEditComponent
} from '../../../../core/components';
import { IncomeListComponent } from './income-list';
import { AccountService } from '../../services';
@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit, AfterViewInit, OnDestroy, AfterViewChecked {
  @ViewChild(DynamicComponentDirective) dynamic: DynamicComponentDirective;
  public changeComponent;
  public done;

  constructor(
    public componentFactoryResolver: ComponentFactoryResolver,
    public system: SystemService,
    public accountService: AccountService,
    public cd: ChangeDetectorRef
  ) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.cd.detectChanges();
    this.accountService.rootComponent.component = IncomeListComponent;
    this.accountService.rootComponent.data = '';
    this.dynamicLoad(IncomeListComponent);
    this.done = this.system.doneEvent.subscribe(() => {
      this.dynamicLoad(this.accountService.rootComponent.component, this.accountService.rootComponent.data);
    });
    this.changeComponent = this.system.changeComponentEvent.subscribe((value: any) => {
      switch (value.component) {
        case 'address-add-edit':
          this.dynamicLoad(AddressAddEditComponent, value.data);
          break;
        case 'incomeCategory-add-edit':
          this.dynamicLoad(IncomeCategoryAddEditComponent, value.data);
          break;
        case 'fundParty-add-edit':
          this.dynamicLoad(FundPartyAddEditComponent, value.data);
          break;
        case 'fundChannel-add-edit':
          this.dynamicLoad(FundChannelAddEditComponent, value.data);
          break;
        case 'fundAccount-add-edit':
          this.dynamicLoad(FundAccountAddEditComponent, value.data);
          break;
        case 'participant-add-edit':
          this.dynamicLoad(ParticipantAddEditComponent);
          break;
        case 'income-list':
          this.dynamicLoad(IncomeListComponent);
          break;
        // case 'expense-detail':
        //   this.dynamicLoad(ExpenseDetailComponent, value.data);
        //   break;
        // case 'expense-list':
        //   this.dynamicLoad(ExpenseListComponent);
        //   break;
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
