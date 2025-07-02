
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./user.model";
import { Router } from "@angular/router";

interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient, private router:Router) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDo-nyw7K0XdFFUhlZpVjoSJi0cTx2p3NM',
        {
          email,
          password,
          returnSecureToken: true
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(this.handleAuthentication.bind(this))
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDo-nyw7K0XdFFUhlZpVjoSJi0cTx2p3NM',
        {
          email,
          password,
          returnSecureToken: true
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(this.handleAuthentication.bind(this))
      );
  }

  logout(){
    this.user.next(null);
    this.router.navigate(['/auth']);
  }

  private handleAuthentication(resData: AuthResponseData) {
    const expirationDate = new Date(
      new Date().getTime() + +resData.expiresIn * 1000
    );
    const user = new User(
      resData.email,
      resData.localId,
      resData.idToken,
      expirationDate
    );
    this.user.next(user);
  }

  private handleError(errorRes: any) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => new Error(errorMessage));
    }

    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email address is already registered.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email is not registered.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'The password is incorrect.';
        break;
      case 'USER_DISABLED':
        errorMessage = 'The user account is disabled.';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = 'Invalid email or password.';
        break;
    }

    return throwError(() => new Error(errorMessage));
  }
}
