import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseUrl } from '../../commons/global.common';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  public addModalVisible: boolean = false;

  constructor(private httpClient: HttpClient) {}

  //get all the roles to show in dropdown
  public getRoles(): Observable<Role[]> {
    return this.httpClient.get<Role[]>(baseUrl + '/Role/GetRoles');
  }

  //get all the roles for the grid
  public getAllRoles(): Observable<Role[]> {
    return this.httpClient.get<Role[]>(baseUrl + '/Role/GetAllRoles');
  }

  public getAllRoleModels(): Observable<any[]> {
    return this.httpClient.get<any[]>(baseUrl + '/RoleModel/ProjectModels');
  }
  //to add a role
  public addRole(data: {
    roleName: string;
    remarks: string;
    startDate: string;
    endDate: string;
    userId?: number;
  }): Observable<any> {
    const formData = new FormData();
    formData.append('roleName', data.roleName);
    formData.append('remarks', data.remarks);
    formData.append('startDate', data.startDate);
    formData.append('endDate', data.endDate);

    if (data.userId !== undefined && data.userId !== null) {
      formData.append('UserId', data.userId.toString());
    }
    return this.httpClient.post(baseUrl + '/Role/AddRoleAsync', formData);
  }

  //get a role based on role ID
  public getRoleById(id: number): Observable<Role> {
    return this.httpClient.get<Role>(baseUrl + '/Role/GetRoleByIdAsync/' + id);
  }

  savePermissions(data: {
    roleId: number;
    modelNames: string[];
    createdBy: string;
  }): Observable<any> {
    return this.httpClient.post(baseUrl + '/RoleModel/AddRoleModel', data, { responseType: 'text' }); 
  }
  
  getPermissionsByRoleId(roleId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(baseUrl + `/RoleModel/${roleId}`);
  }

  //to edit a role
  public editRole(data: {
    id: number;
    roleName: string;
    remarks: string;
    startDate: string;
    endDate: string;
    userId?: number;
    status?: number; // optional since it is 1
  }): Observable<any> {
    const formData = new FormData();
    formData.append('id', data.id.toString());
    formData.append('roleName', data.roleName);
    formData.append('remarks', data.remarks);
    formData.append('startDate', data.startDate);
    formData.append('endDate', data.endDate);
    // formData.append('userId', data.userId.toString());
    if (data.userId !== undefined && data.userId !== null) {
      formData.append('userId', data.userId.toString());
    }
    formData.append('status', (data.status ?? 1).toString()); // default to 1
    return this.httpClient.put(baseUrl + '/Role/EditRoleAsync', formData);
  }

  // to delete a role
  public deleteRole(id: number, userId: number): Observable<any> {
    const url = `${baseUrl}/Role/DeleteRoleAsync?id=${id}&userId=${userId}`;
    return this.httpClient.delete<any>(url);
  
  }
  
}
