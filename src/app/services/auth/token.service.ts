import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() {}

  public setToken(token: string): void{
    window.sessionStorage.removeItem("TOKEN");
    window.sessionStorage.setItem("TOKEN", token);
  }

  public logout(): void{
    window.sessionStorage.clear();
  }

  public getToken(): string{
    return window.sessionStorage.getItem("TOKEN")!;
  }
  
}
