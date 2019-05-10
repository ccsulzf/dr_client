import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { GridOptions } from 'ag-grid';
import "ag-grid-enterprise";
import { ExpenseDetailService } from '../../../services';
@Component({
  selector: 'app-expense-detail',
  templateUrl: './expense-detail.component.html',
  styleUrls: ['./expense-detail.component.scss']
})
export class ExpenseDetailComponent implements OnInit, AfterViewInit {
  gridOptions: GridOptions;
  dataList: [];
  constructor(
    private expenseDetailService: ExpenseDetailService
  ) {
    this.gridOptions = <GridOptions>{
      enableColResize: true,
      enableSorting: true,
      // enableFilter: true,

      // 隐藏表格左边那个columns
      toolPanelSuppressSideButtons: true,
      columnDefs: this.getColumnDefs(),
      rowData: [],
    };
  }


  ngOnInit() {
  }

  @HostListener('window:resize')
  private resizeEvent() {
    this.resize();
  }

  async ngAfterViewInit() {
    this.gridOptions.api.setRowData([]);
    this.resize();
    this.gridOptions.onGridReady = async () => {
      await this.getData();
    };
  }

  async getData() {
    try {
      this.gridOptions.api.showLoadingOverlay();
      this.dataList = [];
      // this.gridOptions.api.setFloatingBottomRowData([]);
      // const data = await this.expenseDetailService.getData();
      this.gridOptions.api.setRowData([]);
      this.resize();
    } catch (error) {

    }

  }

  private resize() {
    this.gridOptions.api.sizeColumnsToFit();
    this.gridOptions.columnApi.autoSizeColumns(this.gridOptions.columnApi.getAllDisplayedColumns());
  }

  getColumnDefs() {
    return [
      { headerName: '日期', field: 'expenseDate', filter: true },
      { headerName: '地点', field: 'addressName', hide: true },
      { headerName: '账本', field: 'expenseBookName' },
      { headerName: '类别', field: 'expenseCategoryName' },
      { headerName: '消费', field: 'content' },
      { headerName: '金额', field: 'amount' },
      { headerName: '付款账户', field: 'fundAccountName' },
      { headerName: '付款渠道', field: 'fundChannelName' },
      { headerName: '收款方', field: 'fundPartyName' },
      { headerName: '标签', field: 'lableList', hide: true },
      { headerName: '参与人', field: 'participantList', hide: true },
      { headerName: '备注', field: 'memo', hide: true },
    ];
  }


}
