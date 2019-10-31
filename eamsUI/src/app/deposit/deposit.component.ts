import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AccountService } from '../service/account.service';
import { Deposit } from '../model/Deposit';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent{

  constructor(public dialogRef: MatDialogRef<DepositComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dataService: AccountService) { }

    onNoClick():void {
      this.dialogRef.close();
    }
    
    save():void {
      console.log("Saved Deposit Data::",this.data);
      this.dataService.saveDeposit(this.data.accountId,this.data.deposit);
      
    }

}
