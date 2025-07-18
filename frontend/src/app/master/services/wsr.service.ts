import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../../commons/global.common';
import { ZohoEmp } from '../models/ZohoEmp';
import { ProjectData } from '../models/wsr-data.model';
import { WSRSubmissionPayload } from '../models/wsr-payload.model';
import { ZohoService } from './zoho.service';
import { ZohoProject } from '../models/ZohoProject';

@Injectable({
  providedIn: 'root',
})
export class WsrService {
  constructor(
    private httpClient: HttpClient,
    private zohoService: ZohoService
  ) {}

  getAllUniqueCustomerProjectDetails(): Observable<any[]> {
    return this.httpClient.get<any[]>(
      `${baseUrl}/ProjectDetails/GetAllProjectUniqueCustomer`
    );
  }

  getMultipleWSRDetails(ids: string[]): Observable<any[]> {
    return this.httpClient.post<any[]>(`${baseUrl}/WSRReport/GetMultipleReports`, ids);
  }

  submitWSRReport(payload: WSRSubmissionPayload): Observable<any> {
    return this.httpClient.post(`${baseUrl}/WSRReport/AddWSRReport`, payload);
  }

  getAllWSRReports(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${baseUrl}/WSRReport/allWSRReport`);
  }

  getWSRReportById(id: string): Observable<any> {
    return this.httpClient.get<any>(
      `${baseUrl}/WSRReport/GetReportById/${id}`
    );
  }

  getFilteredWSRReports(
    projectId: string,
    month: number,
    year: number
  ): Observable<any[]> {
    return this.httpClient.get<any[]>(`${baseUrl}/WSRReport/filterWSRReport`, {
      params: {
        projectId,
        month: month.toString(),
        year: year.toString(),
      },
    });
  }

  updateWSRReport(wsrId: string, payload: any): Observable<any> {
    return this.httpClient.put(`${baseUrl}/WSRReport/UpdateWsrReport/${wsrId}`, payload);
  }

  getAllZohoProjects(): Observable<ZohoProject[]> {
    return this.zohoService.getProjects();
  }

  getAllProjectTypeDetails(): Observable<any> {
    return this.httpClient.get<any>(`${baseUrl}/Master/GetAllProjectType`);
  }

  getConsolidatedReports(wsrReportIds: string[]): Observable<any> {
    return this.httpClient.post<any>(`${baseUrl}/WSRReport/GetConsolidatedReports`, wsrReportIds);
  }
}
