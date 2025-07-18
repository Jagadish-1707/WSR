import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ZohoClient } from '../models/ZohoClient';
import { ZohoProject } from '../models/ZohoProject';
import { baseUrl } from '../../commons/global.common';

@Injectable({
  providedIn: 'root'
})
export class ZohoService {
  getAllZohoEmployees() {
    throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient) {}

  getClients(): Observable<ZohoClient[]> {
    return this.http.get<ZohoClient[]>(`${baseUrl}/ZohoData/clients`);
  }

  getProjects(): Observable<ZohoProject[]> {
    return this.http.get<ZohoProject[]>(`${baseUrl}/ZohoData/projects`);
  }

  getProjectsByClientId(clientId: string): Observable<ZohoProject[]> {
    return this.http.get<ZohoProject[]>(`${baseUrl}/projects/by-client/${clientId}`);
  }
}
