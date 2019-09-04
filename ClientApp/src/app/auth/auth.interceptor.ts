import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    if (localStorage.getItem('Token') !== null) {
      const cloneReq = req.clone({
        headers: req.headers.set(
          'Authorization',
          'Bearer ' + localStorage.getItem('Token')
        )
      });

      return next.handle(cloneReq).pipe(
        tap(
          suc => {},
          err => {
            if (err.status === 401) {
              localStorage.removeItem('Token');
              this.router.navigateByUrl('/login');
            }
          }
        )
      );
    } else {
      return next.handle(req.clone());
    }
  }
}
