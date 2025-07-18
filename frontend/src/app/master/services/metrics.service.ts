import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../../commons/global.common';
import { DevelopmentMetrics, EditDevelopmentMetrics, Metrics } from '../models/metrics';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {

  constructor(private httpClient: HttpClient) { }

  //Metrics Main Page
  getAllMetrics(): Observable<any> {
    return this.httpClient.get<any>(baseUrl + '/Metrics/GetAllMetricsData');
  }

  getMetricsById(id: number): Observable<any> {
    return this.httpClient.get(baseUrl + '/Metrics/GetMetricsById/' + id);
  }

  addMetrics(result: any): Observable<any> {
    return this.httpClient.post(baseUrl + '/Metrics/AddMetrics', result,
      {
        headers: { 'Content-Type': 'application/json' }
      });
  }
  editMetrics(metrics: any) {
    return this.httpClient.put(baseUrl + '/Metrics/EditMetricsDetails', metrics, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getProjectTypeByProjectId(id: string): Observable<any> {
    return this.httpClient.get(baseUrl + '/Metrics/GetProjectTypeByProjectId/' + id);
  }

  getAllComplexity(): Observable<any> {
    return this.httpClient.get<any>(
      baseUrl + '/Complexity/GetAllComplexity'
    );
  }

  //metrics project column services
  getAllMetricProjectColumns(): Observable<any> {
    return this.httpClient.get<any>(baseUrl + '/MetricProjectColumns/GetAllMetricProjectColumns');
  }

  getMetricProjectColumnsById(id: number): Observable<any> {
    return this.httpClient.get(baseUrl + '/MetricProjectColumns/GetMetricProjectColumnsById/' + id);
  }

  addMetricProjectColumns(result: any): Observable<any> {
    return this.httpClient.post(baseUrl + '/MetricProjectColumns/AddMetricProjectColumns', result,
      {
        headers: { 'Content-Type': 'application/json' }
      });
  }

  editMetricProjectColumns(projectDetails: any) {
    return this.httpClient.put(baseUrl + '/MetricProjectColumns/EditMetricProjectColumns', projectDetails, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  //metrics column selections
  addMetricsColumn(result: any): Observable<any> {
    return this.httpClient.post(baseUrl + '/MetricProjectColumns/AddMetricsProjectColumnSelection', result,
      {
        headers: { 'Content-Type': 'application/json' }
      });
  }
  getMetricsColumnList(): Observable<any> {
    return this.httpClient.get<any>(baseUrl + '/MetricProjectColumns/GetAllMetricProjectColumnsSelected');
  }
  getMetricsColumnById(id: number): Observable<any> {
    return this.httpClient.get(baseUrl + '/MetricProjectColumns/GetMetricProjectColumnsSelectedById/' + id);
  }

  checkProjectMetricExists(projectTypeId: number): Observable<boolean> {
    return this.httpClient.get<boolean>(baseUrl + `/MetricProjectColumns/CheckDuplicateCombination?projectTypeId=${projectTypeId}`);
  }

  getTaskMetricsByProjectId(id: number): Observable<any> {
    return this.httpClient.get(baseUrl + '/MetricProjectColumns/GetTaskMetricsByProjectId/' + id);
  }

  getMetricsGridColumSelected(id: string | undefined): Observable<any> {
    return this.httpClient.get(baseUrl + '/MetricProjectColumns/GetMetricsGridColumSelected/' + id);
  }

  //sla and priority from master
   getSLAMetricsList(): Observable<any> {
    return this.httpClient.get<any>(baseUrl + '/SLA/GetSLAMetricsList');
  }
   getMetricsPriorityList(): Observable<any> {
    return this.httpClient.get<any>(baseUrl + '/SLA/GetMetricsPriorityList');
  }

   getMetricsAssignedEmployee(id: string | undefined): Observable<any> {
    return this.httpClient.get(baseUrl + '/Metrics/GetMetricsAssignedEmployee/' + id);
  }

}
