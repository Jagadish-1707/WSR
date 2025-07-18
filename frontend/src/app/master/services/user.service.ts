import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../../commons/global.common';
import { User } from '../models/user';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  public getAllUser(): Observable<User[]> {
    return this.httpClient.get<User[]>(baseUrl + '/Users/GetAllUsers');
  }
}
