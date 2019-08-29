import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false); 
  private username = new BehaviorSubject<string>('admin'); // {1}

  get isLoggedIn() {
    return this.loggedIn.asObservable(); // {2}
  }
  get getUsername():Observable<string> {
    return this.username.asObservable();
  }

  constructor(
    private router: Router
  ) {}

  login(user: User){
    if (user.userName == 'admin' && user.password == 'admin' ) { // {3}
      this.loggedIn.next(true);
      this.username.next('admin');
      this.router.navigate(['/']);
    }
  }

  logout() {                            // {4}
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
}

