/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../../commons/global.common';
import { AssignRole } from '../models/assignRole';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root',
})
export class ManageUserService {
  public addModalVisible: boolean = false;

  constructor(private httpClient: HttpClient) {}

  //get all department names
  public getDepartments(): Observable<{ departmentId: number; departmentName: string }[]> {
    return this.httpClient.get<{ departmentId: number; departmentName: string }[]>(
      baseUrl + '/Admin/GetDepartments'
    );
  }
  

  public getRoles(): Observable<Role[]> {
    return this.httpClient.get<Role[]>(`${baseUrl}/Role/GetAllRoles`);
  }
  

  //to assign a role to a user
  public addAssignRole(data: AssignRole): Observable<any> {
    return this.httpClient.post(`${baseUrl}/Admin/AddAssignRoleAsync`, data);
  }

  public editAssignRole(data: AssignRole): Observable<any> {
    return this.httpClient.put(`${baseUrl}/Admin/EditAssignRoleAsync`, data);
  }
  
  

  //to get all the assigned roles for the grid
  public getAllAssignRoles(): Observable<AssignRole[]> {
    return this.httpClient.get<AssignRole[]>(
      `${baseUrl}/Admin/GetAllAssignRoles`
    );
  }

  //get a assigned role based on ID
  public GetAssignRoleById(id: number): Observable<AssignRole> {
    return this.httpClient.get<AssignRole>(
      baseUrl + '/Admin/GetAssignRoleByIdAsync/' + id
    );
  }
}
