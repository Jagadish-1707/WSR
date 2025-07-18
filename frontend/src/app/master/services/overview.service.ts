import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task';
import { baseUrl } from '../../commons/global.common';
import { DevelopmentMetrics } from '../models/metrics';


@Injectable({
  providedIn: 'root',
})
export class OverviewService {
  constructor(private httpClient: HttpClient) {}

  getAllTasks(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(
      baseUrl + '/TaskDetails/GetAllTaskDetails'
    );
  }
  getAllDevMetrics(): Observable<DevelopmentMetrics[]>{
    return this.httpClient.get<DevelopmentMetrics[]>(baseUrl +'/DevelopmentMertics/GetDevMetrics' )
  }
  getChartsForTicketClosed(
    customerId: number,
    projectId: number,
    projectType: string
  ): Observable<any> {
    const url = `${baseUrl}/Metrics/ChartForTicketColsed/${customerId}/${projectId}/${projectType}`;
    return this.httpClient.get<any>(url);
  }
}
