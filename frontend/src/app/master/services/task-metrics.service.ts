import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseUrl } from '../../commons/global.common';
import { AddTaskMetricsDto, EditTaskMetricsDto, TaskMetricsResponse } from '../models/TaskMetrics';

@Injectable({
  providedIn: 'root',
})
export class TaskMetricsService {

  constructor(private http: HttpClient) {}

  // Add new task metrics
  addTaskMetrics(addTaskMetricsDto: AddTaskMetricsDto): Observable<any> {
    return this.http.post<any>(`${baseUrl}/taskmetrics/add-task-metrics`, addTaskMetricsDto);
  }

  // Edit existing task metrics
  editTaskMetrics(editTaskMetricsDto: EditTaskMetricsDto): Observable<any> {
    return this.http.put<any>(`${baseUrl}/taskmetrics/edit-task-metrics`, editTaskMetricsDto);
  }

  // Get task metrics by TaskId
  getTaskMetricsByTaskId(taskId: number): Observable<TaskMetricsResponse[]> {
    return this.http.get<TaskMetricsResponse[]>(`${baseUrl}/taskmetrics/task-metrics/${taskId}`);
  }
}
