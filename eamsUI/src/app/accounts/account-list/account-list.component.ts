import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AccountService } from 'src/app/service/account.service';
import { Account } from '../../model/Account';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, merge, fromEvent } from 'rxjs';
import { MatPaginator, MatSort, MatDialog } from '@angular/material';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AccountAddComponent } from '../account-add/account-add.component';
@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
})
export class AccountListComponent implements OnInit {

  imageWidth = 60;
  imageMargin = 2;
  showImage = false;
  pageTitle: string = 'Account-List'
  displayedColumns = ['accountId', 'accountName', 'fatherName', 'balance', 'address', 'email', 'phone', 'imageUrl', 'lastUpdate', 'createdAt', 'actions'];
  exampleDatabase: AccountService | null;
  dataSource: ExampleDataSource | null;
  index: number;
  accountId: string;
  table: string;
  mask: any[] = ['+', '1', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(public httpClient: HttpClient,
    public dialog: MatDialog,
    public dataService: AccountService) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  ngOnInit() {
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  toggleImage() {
    this.showImage = !this.showImage;
  }

  addNew(account: Account): void {
    const dialogRef = this.dialog.open(AccountAddComponent, {
      data: { account: account }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // After dialog is closed we're doing frontend updates
        // For add we're just pushing a new row inside DataService
        this.exampleDatabase.dataChange.value.push(this.dataService.getDialogData());
        this.loadData();
      }
    });
  }
  delete(accountId:number): void {
    if(confirm('Are you sure you want to delete of Account Number '+ accountId)) {
      this.dataService.deleteAccount(accountId).subscribe();
    }        
  }
  public loadData() {
    this.exampleDatabase = new AccountService(this.httpClient, null, null);
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
    fromEvent(this.filter.nativeElement, 'keyup')
      // .debounceTime(150)
      // .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }

}


export class ExampleDataSource extends DataSource<Account> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: Account[] = [];
  renderedData: Account[] = [];

  constructor(public _exampleDatabase: AccountService,
    public _paginator: MatPaginator,
    public _sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Account[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this._exampleDatabase.getAllAccounts();


    return merge(...displayDataChanges).pipe(map(() => {
      // Filter data
      this.filteredData = this._exampleDatabase.data.slice().filter((account: Account) => {
        const searchStr = (account.accountId + account.accountName + account.fatherName + account.balance +
          account.address + account.email + account.imageUrl + account.phone + account.lastUpdate + account.createdAt).toLowerCase();
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
  sortData(data: Account[]): Account[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'accountId': [propertyA, propertyB] = [a.accountId, b.accountId]; break;
        case 'accountName': [propertyA, propertyB] = [a.accountName, b.accountName]; break;
        case 'fatherName': [propertyA, propertyB] = [a.fatherName, b.fatherName]; break;
        case 'balance': [propertyA, propertyB] = [a.balance, b.balance]; break;
        case 'address': [propertyA, propertyB] = [a.address, b.address]; break;
        case 'email': [propertyA, propertyB] = [a.email, b.email]; break;
        case 'phone': [propertyA, propertyB] = [a.phone, b.phone]; break;
        case 'imageUrl': [propertyA, propertyB] = [a.imageUrl, b.imageUrl]; break;
        case 'lastUpdate': [propertyA, propertyB] = [a.lastUpdate, b.lastUpdate]; break;
        case 'createdAt': [propertyA, propertyB] = [a.createdAt, b.createdAt]; break;

      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}

