import { Injectable } from '@angular/core';
import { TokenService } from '../services/auth/token.service';
import { LoginService } from '../services/auth/login.service';
import { Router } from '@angular/router';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class ExpiredService implements HttpInterceptor{

  constructor(private tokenService: TokenService,
    private loginService: LoginService,
    private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const token = this.tokenService.getToken();
  
      if (token && this.isTokenExpired(token)) {
        this.loginService.logout();
        this.router.navigate(['/login']);
        return next.handle(req); 
      }
      if (token) {
        const clonedRequest = req.clone({
          headers: req.headers.set('Authorization', 'Bearer ' + token)
        });
        return next.handle(clonedRequest);
      }
  
      return next.handle(req); 
    }

    private isTokenExpired(token: string): boolean {
      const decodedToken = jwtDecode(token) as { exp: number };
      const currentTime = Math.floor(Date.now() / 1000);
  
      return decodedToken.exp < currentTime;
    }
}
