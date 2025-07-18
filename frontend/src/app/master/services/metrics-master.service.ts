import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MetricsMaster } from '../models/metricsMaster';
import { baseUrl } from '../../commons/global.common';

@Injectable({
  providedIn: 'root'
})
export class MetricsMasterService {


  constructor(private http: HttpClient) { }

  // Add new MetricsMaster
  addMetricsMaster(metrics: MetricsMaster): Observable<MetricsMaster> {
    return this.http.post<MetricsMaster>(`${baseUrl}/Master/AddMetrics`, metrics);
  }

  // Edit existing MetricsMaster
  editMetricsMaster(metrics: MetricsMaster): Observable<MetricsMaster> {
    return this.http.put<MetricsMaster>(`${baseUrl}/Master/EditMetricsMaster`, metrics);
  }

  // Get list of MetricsMaster
  getMetricsMasterList(): Observable<MetricsMaster[]> {
    return this.http.get<MetricsMaster[]>(`${baseUrl}/Master/GetAllMetricsList`);
  }

  // Get a MetricsMaster by ID
  getMetricsMasterById(id: number): Observable<MetricsMaster> {
    return this.http.get<MetricsMaster>(`${baseUrl}/Master/GetMetricsById/${id}`);
  }

   // Get list of MetricsMaster
  getAllMetricsMasterList(): Observable<MetricsMaster[]> {
    return this.http.get<MetricsMaster[]>(`${baseUrl}/Master/GetAllMetricsMaster`);
  }
  
}
