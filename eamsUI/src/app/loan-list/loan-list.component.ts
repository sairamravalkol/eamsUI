import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { LoanService } from "../service/loan.service";
import { Deposit } from "../model/Deposit";
import { HttpClient } from "@angular/common/http";
import {
  MatDialog,
  MatPaginator,
  MatSort,
  MatTableDataSource,
} from "@angular/material";
import { fromEvent, BehaviorSubject, Observable, merge } from "rxjs";
import { DataSource } from "@angular/cdk/table";
import { Loan } from "../model/Loan";
import { map } from "rxjs/operators";

@Component({
  selector: "app-loan-list",
  templateUrl: "./loan-list.component.html",
  styleUrls: ["./loan-list.component.css"],
})
export class LoanListComponent implements OnInit {
  displayedColumns = [
    "loanId",
    "accId",
    "accountName",
    "loanAmt",
    "lastUpdate",
  ];

  dataSource = new MatTableDataSource<Loan[]>();
  data: any;

  constructor(public dataService: LoanService) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("filter") filter: ElementRef;

  ngOnInit() {
    this.dataService.geAllLoans().subscribe((data) => {
      this.data = data;
      this.dataSource.data = this.data;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
