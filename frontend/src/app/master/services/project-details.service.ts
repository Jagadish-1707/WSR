import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../../commons/global.common';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ProjectDetailsService {
  headers!: HttpHeaders;

  // baseUrl : string='http://192.168.1.10:98/api';
  //New AMS API
  // http://192.168.1.10:98/api/Transaction/GetEmployeeCientList

  constructor(private httpClient: HttpClient) { }

  addProjectDetails(projectDetails: any): Observable<any> {

    return this.httpClient.post(baseUrl + '/ProjectDetails/AddProjectDetails', projectDetails)
  }

  getProjectDetailsById(id: number): Observable<any> {

    return this.httpClient.get(baseUrl + '/ProjectDetails/GetProjectDetailsById/' + id);
  }

  editProjectDetails(projectDetails: FormGroup): Observable<any> {

    return this.httpClient.put(baseUrl + '/ProjectDetails/EditProjectDetails', projectDetails)
  }

  getAllProjectDetails(): Observable<any> {
    return this.httpClient.get<any>(baseUrl + '/ProjectDetails/GetAllProjectDetails');
  }

  getAllUniqueCustomerProjectDetails(): Observable<any> {
    return this.httpClient.get<any>(baseUrl + '/ProjectDetails/GetAllProjectUniqueCustomer');
  }

  DeleteProjectDetails(ProjectId: number, userId: number): Observable<any> {
    const url = `${baseUrl}/ProjectDetails/DeleteProjectDetails?id=${ProjectId}&userId=${userId}`;
    return this.httpClient.delete(url);
  }

  //Project Engagement Mode Services

  getAllEngagementMode(): Observable<any> {
    return this.httpClient.get<any>(baseUrl + '/ProjectDetails/GetAllEngagementMode');
  }

  getEngagmentModeById(id: number): Observable<any> {
    return this.httpClient.get(baseUrl + '/ProjectDetails/GetEngagmentModeById/' + id);
  }

  addEngagmentMode(result: any): Observable<any> {
    return this.httpClient.post(baseUrl + '/ProjectDetails/AddEngagmentMode', result,
      { headers: this.headers, responseType: 'json' });
  }

  editEngagementMode(projectDetails: any) {
    return this.httpClient.put(baseUrl + '/ProjectDetails/EditEngagementMode', projectDetails, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getAllClients(): Observable<any> {

    return this.httpClient.get<any>(baseUrl + '/Transaction/GetEmployeeCientList');
  }

  getAllProjects(): Observable<any> {
    return this.httpClient.get<any>(baseUrl + '/Transaction/GetProjectList/Active');
  }

  getAllAmsProject(id: number): Observable<any> {
    return this.httpClient.get<any>(baseUrl + '/Transaction/GetEmployeeProjectList/' + id);
  }


}
