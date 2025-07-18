import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../../commons/global.common';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public isLoggedIn: boolean = false;
  private readonly AUTH_TOKEN_KEY = 'authToken';
  
  constructor(private httpClient: HttpClient) { 
    this.isLoggedIn = !!localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  public sendOTP(user: string): Observable<unknown> {

    return this.httpClient.get(baseUrl + '/Login/SendOTP/' + user);
  }

  public verifyOTP(otp: FormData): Observable<unknown> {
    console.log(otp,"otpdata");
    
    return this.httpClient.put(baseUrl + '/Login/AddLogin', otp);
  }

  public setIsLoggedIn(value: boolean) {
    if (value) {
      // Set authentication token in local storage
      localStorage.setItem(this.AUTH_TOKEN_KEY, 'JWL');
    this.isLoggedIn = value;
    console.log(this.isLoggedIn);
  }else{
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
 
  }
}
  
   
}
