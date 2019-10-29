import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AccountService } from '../service/account.service';

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css']
})
export class DepositComponent{

  constructor(public dialogRef: MatDialogRef<DepositComponent>,
    @Inject(MAT_DIALOG_DATA) public account: Account,
    public dataService: AccountService) { }

    
  

}
