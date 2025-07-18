import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../models/task';
import { baseUrl } from '../../commons/global.common';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  public addModalVisible: boolean = false;

  constructor(private httpClient: HttpClient) { }

  getAllTasks(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(baseUrl + '/TaskDetails/GetAllTaskDetails');
  }
  getAllProjectUniqueCustomer(): Observable<any> {

    return this.httpClient.get<any>(baseUrl + '/ProjectDetails/GetAllProjectUniqueCustomer');
  }

  getAllProjectByCustomerId(id: string): Observable<any> {

    return this.httpClient.get<any>(baseUrl + '/TaskDetails/GetAllTaskDetails/' + id);
  }

  addTask(task: Task): Observable<Task> {
    return this.httpClient.post<Task>(baseUrl + '/TaskDetails/TaskDetails', task);
  }

  getTaskById(id: number): Observable<Task> {
    return this.httpClient.get<Task>(baseUrl + '/TaskDetails/GetTaskDetailsById/' + id);
  }

  editTask(task: Task): Observable<Task> {
    return this.httpClient.put<Task>(baseUrl + '/TaskDetails/EditTaskDetails', task);
  }
  deleteTask(taskId: number, userId: number): Observable<any> {
    const url = `${baseUrl}/TaskDetails/DeleteTask?id=${taskId}&userId=${userId}`;
    return this.httpClient.delete(url);
  }

  getAssignedEmployee(id: number): Observable<any> {
    return this.httpClient.get<any>(baseUrl + '/TaskDetails/GetAssignedEmployee/' + id);
  }

  getAssignedMetrics(id: number): Observable<any> {
    return this.httpClient.get<any>(baseUrl + '/TaskDetails/GetAssignedMetrics/' + id);
  }
}
