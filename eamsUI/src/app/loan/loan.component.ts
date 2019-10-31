import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AccountService } from '../service/account.service';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css']
})
export class LoanComponent {

  constructor(public dialogRef: MatDialogRef<LoanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dataService: AccountService) { }

    onNoClick():void {
      this.dialogRef.close();
    }
    saveLoan():void {
      console.log("Loan saved data::",this.data);
      this.dataService.saveLoan(this.data.accountId,this.data.loan);
    }
}
