import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Account } from '../model/Account'
import { AuthService } from './auth.service';
import { MessageService } from '../message.service';
import { Deposit } from '../model/Deposit';
import { Loan } from '../model/Loan';
import { strictEqual } from 'assert';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  // private accountUrl = 'http://localhost:8008/Accounts';
  private BASE_URL = 'http://localhost:8008/';

  dataChange: BehaviorSubject<Account[]> = new BehaviorSubject<Account[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  result: Object;
  constructor(private http: HttpClient, private authService: AuthService, private messageService: MessageService) { }
  get data(): Account[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }
  getDepositByAccountId(accountId: string): Observable<Deposit> {
    return this.http.get<Deposit>(this.BASE_URL + 'getDepositByAccountId/' + accountId).pipe(
      tap(_ => this.log(`Get Deposit by id =${accountId}`)),
      catchError(this.ErrorHandler<Deposit>('Deleted Account'))
    );
  }

  getAllAccounts(): void {
    this.http.get<Account[]>(this.BASE_URL + 'Accounts').subscribe(data => {
      this.dataChange.next(data);
      console.log("Account-List::", data);
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }
  saveDeposit(accountId: string, deposit: Deposit): void {
    this.http.post(this.BASE_URL + 'Accounts/' + accountId + '/Deposits', deposit).subscribe(deposit => deposit, (error: HttpErrorResponse) => {
      console.log(error.name + ' ' + error.message);
    })
  }
  saveLoan(accountId: string, loan: Loan): void {

    this.http.post(this.BASE_URL + 'Accounts/' + accountId + '/Loans', loan).subscribe(/* result => {
      this.result = result;
    console.log("Save Loan",this.result)
  } */
     (error: HttpErrorResponse) => {
      console.log(error.name + ' ' + error.message);
    })
  }

  /* getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.accountUrl).pipe(
      tap(data => console.log('All: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }
 */
  addAccount(account: Account): void {
    this.http.post(this.BASE_URL + 'Accounts', account).subscribe(account => {
      this.dialogData = account;
      /*this.toasterService.showToaster('Successfully added', 3000);*/
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }
  addItem(account: Account): void {
    this.http.post(this.BASE_URL + 'Accounts', account).subscribe(account => {
      this.dialogData = account;
      /*this.toasterService.showToaster('Successfully added', 3000);*/
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }
  deleteAccount(account: Account | number): Observable<Account> {
    const id = typeof account === 'number' ? account : account.accountId;
    return this.http.delete<Account>(this.BASE_URL + 'Accounts/' + id).pipe(
      tap(_ => this.log(`deleted Account id=${id}`)),
      catchError(this.ErrorHandler<Account>('Deleted Account'))
    );
  }
  private handleError(err: HttpErrorResponse) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private ErrorHandler<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}

