import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { Deposit } from "../model/Deposit";
import { LoanService } from "../service/loan.service";

@Component({
  selector: "app-deposit-list",
  templateUrl: "./deposit-list.component.html",
  styleUrls: ["./deposit-list.component.css"],
})
export class DepositListComponent implements OnInit {
  interestTotal: string;
  displayedColumns = [
    "depositId",
    "accId",
    "accountName",
    "basic",
    "loanTotal",
    "interestTotal",
    "total",
    "lastUpdate",
  ];

  dataSource = new MatTableDataSource<Deposit[]>();
  data: any;

  constructor(public dataService: LoanService) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("filter") filter: ElementRef;

  ngOnInit() {
    this.dataService.getAllDeposits().subscribe((data) => {
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
