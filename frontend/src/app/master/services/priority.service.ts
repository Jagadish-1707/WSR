import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../../commons/global.common';
import { Priority } from '../models/priority';

@Injectable({
  providedIn: 'root',
})
export class PriorityService {
  baseUrl: string = 'http://192.168.1.10:98/api';

  constructor(private httpClient: HttpClient) {}

  getAllClients(): Observable<any> {
    return this.httpClient.get<any>(
      baseUrl + '/Transaction/GetClientList/Active'
    );
  }

  getAllProjects(): Observable<any> {
    return this.httpClient.get<any>(
      baseUrl + '/Transaction/GetProjectList/Active'
    );
  }

  getAllPriority(): Observable<any> {
    return this.httpClient.get<any>(baseUrl + '/Priority/GetAllPriority');
  }

  addPriority(result: Priority): Observable<any> {
    console.log(result,"priority");
    return this.httpClient
      .post(baseUrl + '/Priority/AddPriorityAsync', result)
      .pipe();  
  }

  editPriority(priority: any){
    return this.httpClient.put(
      baseUrl + '/Priority/EditPriorityAsync',
      priority
    ).pipe();
  }

  getPriorityById(id: number): Observable<any> {
    return this.httpClient.get(
      baseUrl + '/Priority/GetPriorityByIdAsync/' + id
    );
  }
}
