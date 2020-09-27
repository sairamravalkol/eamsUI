import { Injectable } from "@angular/core";
import { Observable, of, BehaviorSubject } from "rxjs";
import { Loan } from "../model/Loan";
import { Account } from "../model/Account";
import {
  HttpHeaders,
  HttpClient,
  HttpErrorResponse,
} from "@angular/common/http";
import { MessageService } from "../message.service";
import { AuthService } from "./auth.service";
import { tap, catchError } from "rxjs/operators";
import { Deposit } from "../model/Deposit";

@Injectable({
  providedIn: "root",
})
export class LoanService {
  private BASE_URL = "http://localhost:8008/";

  dataChange: BehaviorSubject<Loan[]> = new BehaviorSubject<Loan[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
    }),
  };
  result: Object;
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}
  get data(): Loan[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /*   getAllLoans(): void {
    this.http.get<Loan[]>(this.BASE_URL + "Loans").subscribe(
      (data) => {
        this.dataChange.next(data);
        console.log("Loan-List::", data);
      },
      (error: HttpErrorResponse) => {
        console.log(error.name + " " + error.message);
      }
    );
  } */
  geAllLoans(): Observable<Loan> {
    return this.http.get<Loan>(this.BASE_URL + "Loans").pipe(
      tap((_) => this.log(`All Loans `)),
      catchError(this.ErrorHandler<Loan>("GetAll Loans"))
    );
  }
  getAllDeposits(): Observable<Deposit> {
    return this.http.get<Deposit>(this.BASE_URL + "Deposits").pipe(
      tap((_) => this.log(`All Deposits`)),
      catchError(this.ErrorHandler<Deposit>("Get All Deposits"))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private ErrorHandler<T>(operation = "operation", result?: T) {
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
