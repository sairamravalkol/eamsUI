import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AccountService } from 'src/app/service/account.service';
import { FormControl, Validators } from '@angular/forms';
import { Account } from 'src/app/model/Account';

@Component({
  selector: 'app-account-add',
  templateUrl: './account-add.component.html',
  styleUrls: ['./account-add.component.css']
})
export class AccountAddComponent{

  constructor(public dialogRef: MatDialogRef<AccountAddComponent>,
    @Inject(MAT_DIALOG_DATA) public account: Account,
    public dataService: AccountService) { }

formControl = new FormControl('', [
Validators.required,
Validators.email
]);

getErrorMessage() {
return this.formControl.hasError('required') ? 'Required field' :
this.formControl.hasError('email') ? 'Not a valid email' :
'';
}


onNoClick(): void {
this.dialogRef.close();
}

public confirmAdd(): void {
  console.log("Called confirmadd")
this.dataService.addAccount(this.account);
}
}

