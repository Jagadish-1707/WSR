import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ZohoEmp } from '../models/ZohoEmp';
import { baseUrl } from '../../commons/global.common';

@Injectable({
  providedIn: 'root'
})
export class ZohoDataService {

  constructor(private http: HttpClient) { }

  getAllZohoEmployees(): Observable<ZohoEmp[]> {
    return this.http.get<ZohoEmp[]>(`${baseUrl}/employee/activeEmployees`);
  }
}
