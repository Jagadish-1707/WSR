import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { baseUrl } from '../../commons/global.common';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ProjectTypeService {

  constructor(private httpClient : HttpClient) { }


  getAllProjectTypeDetails() : Observable<any>{
    return this.httpClient.get<any>(baseUrl+'/Master'+'/GetAllProjectType');
  }

   getProjectTypeDetailsById(id:number): Observable<any>{

    return this.httpClient.get(baseUrl+ '/Master'+'/GetProjectTypeById/'+id);
  }

   addProjectTypeDetails(projectTypeDetails:any): Observable<any>{

    return this.httpClient.post(baseUrl+ '/Master'+'/AddProjectType',projectTypeDetails)
  }

   editProjectTypeDetails(projectTypeData:FormGroup): Observable<any>{

    return this.httpClient.put(baseUrl+'/Master/EditProjectType',projectTypeData)
  }
}
