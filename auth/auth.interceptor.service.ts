import { Injectable } from "@angular/core";
import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest, HttpEvent } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { take, exhaustMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.user.pipe(
            take(1),
            exhaustMap(user => {
                if (!user) {
                    // No user => proceed without modifying the request
                    return next.handle(req);
                }

                const modifiedReq = req.clone({
                    params: new HttpParams().set('auth', user.token)
                });

                return next.handle(modifiedReq);
            })
        );
    }
}
