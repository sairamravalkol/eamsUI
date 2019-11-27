import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoanService } from '../service/loan.service';
import { Deposit } from '../model/Deposit';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { fromEvent, BehaviorSubject, Observable, merge } from 'rxjs';
import { DataSource } from '@angular/cdk/table';
import { Loan } from '../model/Loan';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.css']
})
export class LoanListComponent implements OnInit {

  displayedColumns = ['loanId', 'loanAmt', 'lastUpdate'];
  exampleDatabase: LoanService | null;
  dataSource: ExampleDataSource | null;
  index: number;
  companyName: string;
  table: string;
  mask: any[] = ['+', '1', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(public httpClient: HttpClient,
    public dialog: MatDialog,
    public dataService: LoanService) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  ngOnInit() {
    this.loadData();
  }





  public loadData() {
    this.exampleDatabase = new LoanService(this.httpClient, null);
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
    fromEvent(this.filter.nativeElement, 'keyup')
 
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });

  }
}

export class ExampleDataSource extends DataSource<Loan> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {

    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: Loan[] = [];
  renderedData: Loan[] = [];

  constructor(public _exampleDatabase: LoanService,
    public _paginator: MatPaginator,
    public _sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Loan[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this._exampleDatabase.getAllLoans();


    return merge(...displayDataChanges).pipe(map(() => {
      // Filter data
      this.filteredData = this._exampleDatabase.data.slice().filter((loan: Loan) => {
        const searchStr = (loan.loanId + loan.loanAmt + loan.lastUpdate).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });

      // Sort filtered data
      const sortedData = this.sortData(this.filteredData.slice());

      // Grab the page's slice of the filtered sorted data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
      return this.renderedData;
    }
    ));
  }

  disconnect() { }


  /** Returns a sorted copy of the database data. */
  sortData(data: Loan[]): Loan[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'loanId': [propertyA, propertyB] = [a.loanId, b.loanId]; break;
        case 'loanAmt': [propertyA, propertyB] = [a.loanAmt, b.loanAmt]; break;
        case 'lastUpdate': [propertyA, propertyB] = [a.lastUpdate, b.lastUpdate]; break;

      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}



