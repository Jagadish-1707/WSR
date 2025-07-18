import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../../commons/global.common';

@Injectable({
  providedIn: 'root',
})
export class ComplexityService{

  baseUrl : string='http://192.168.1.10:98/api';

  constructor(private httpClient: HttpClient) {}

  getAllClients(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/Transaction/GetClientList/Active`);
  }

  getAllProjects(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseUrl}/Transaction/GetProjectList/Active`);
  }

  getAllComplexity(): Observable<any> {
    return this.httpClient.get<any>(`${baseUrl}/Complexity/GetAllComplexity`);
  }
  
  addComplexity(complexity: FormData) {
    return this.httpClient
      .post(baseUrl + '/Complexity/AddComplexityAsync', complexity)
      .pipe();
  }

  editComplexity(complexity: any){
    return this.httpClient
    .put(baseUrl + '/Complexity/EditComplexityAsync',complexity)
    .pipe();
  }


  getComplexityById(id: number): Observable<any> {
    return this.httpClient.get(
      baseUrl + '/Complexity/GetComplexityByIdAsync/' + id 
    );
  }
}
