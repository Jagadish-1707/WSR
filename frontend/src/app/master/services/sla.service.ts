import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../../commons/global.common';

@Injectable({
  providedIn: 'root'
})
export class SlaService {
  constructor(private httpClient: HttpClient) { }

  getAllPriority(): Observable<any> {
    return this.httpClient.get<any>(baseUrl + '/SLA/GetPriorityList');
  }
  getAllSLA(): Observable<any> {
    return this.httpClient.get<any>(baseUrl + '/SLA/GetSLAList');
  }
  AddSLA(slaDetails: any): Observable<any> {
    return this.httpClient.post(baseUrl + '/SLA/AddSLAAsync', slaDetails);
  }
  editSLA(updatedSLA: any) {
    return this.httpClient.put(baseUrl + '/SLA/EditSLADetails', updatedSLA);
  }
  getSLAById(id: number): Observable<any> {
    return this.httpClient.get(baseUrl + '/SLA/GetSLAById/' + id);
  }

  GetResponseSLAList(): Observable<any> {
    return this.httpClient.get<any>(baseUrl + '/SLA/GetResponseSLAList');
  }
  AddResponseSLA(slaDetails: any): Observable<any> {
    return this.httpClient.post(baseUrl + '/SLA/AddResponseSLA', slaDetails);
  }

  EditResponseSLA(updatedSLA: any) {
    return this.httpClient.put(baseUrl + '/SLA/EditResponseSLA', updatedSLA);
  }
  GetResponseSLAById(id: number): Observable<any> {
    return this.httpClient.get(baseUrl + '/SLA/GetResponseSLAById/' + id);
  }

}
