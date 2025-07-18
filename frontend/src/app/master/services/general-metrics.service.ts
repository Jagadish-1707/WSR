import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { generalMetrics } from '../models/generalMetrics';
import { baseUrl } from '../../commons/global.common';

@Injectable({
  providedIn: 'root',
})
export class GeneralMetricsService {
  constructor(private http: HttpClient) {}

  // Get list of Generel Metric Type
  getGeneralMetricsList(): Observable<generalMetrics[]> {
    return this.http.get<generalMetrics[]>(
      `${baseUrl}/Master/GetGeneralMetricsList`
    );
  }

  // Add new Generel Metric Type
  addGeneralMetricsMaster(
    generalmetrics: generalMetrics
  ): Observable<generalMetrics> {
    return this.http.post<generalMetrics>(
      `${baseUrl}/Master/AddGeneralMetrics`,
      generalmetrics
    );
  }

  // Edit existing Generel Metric Type
  editGeneralMetricsMaster(
    generalmetrics: generalMetrics
  ): Observable<generalMetrics> {
    return this.http.put<generalMetrics>(
      `${baseUrl}/Master/EditGeneralMetrics`,
      generalmetrics
    );
  }

  // Get a Generel Metric Type by ID
  getGeneralMetricsById(id: number): Observable<generalMetrics> {
    return this.http.get<generalMetrics>(
      `${baseUrl}/Master/GetGeneralMetricsById/${id}`
    );
  }
}
