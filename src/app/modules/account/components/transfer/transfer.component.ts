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

import { TransferService, AccountService } from '../../services';
import { TransferAddEditComponent, TransferListComponent } from '../transfer';
@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  @ViewChild(DynamicComponentDirective) dynamic: DynamicComponentDirective;
  public changeComponent;
  public done;
  constructor(
    public componentFactoryResolver: ComponentFactoryResolver,
    public accountService: AccountService,
    public system: SystemService,
    public cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.accountService.rootComponent.component = TransferListComponent;
    this.accountService.rootComponent.data = '';
    this.dynamicLoad(TransferListComponent);
    this.done = this.system.doneEvent.subscribe(() => {
      this.dynamicLoad(this.accountService.rootComponent.component, this.accountService.rootComponent.data);
    });

    this.changeComponent = this.system.changeComponentEvent.subscribe((value: any) => {
      switch (value.component) {
        case 'fundAccount-add-edit':
          this.dynamicLoad(FundAccountAddEditComponent, value.data);
          break;
        case 'transfer-list':
          this.dynamicLoad(TransferListComponent);
          break;
        default:
          break;
      }
    });
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

  ngAfterViewChecked() {
    this.cd.detectChanges();
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
