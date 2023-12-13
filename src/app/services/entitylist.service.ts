import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EntityListDto } from '../models/EntitylistDto.model';


@Injectable({ 
  providedIn: 'root'
})
export class EntitylistService {
  // private apiUrl = 'https://localhost:7245/api/entitylist';
  private apiUrlGateway = 'https://localhost:7093/api/entitylist';
  constructor(private http:HttpClient) { }
  getEntityList(): Observable<EntityListDto[]> {  
    console.log(this.apiUrlGateway,"this.apiUrlGateWay")  
    return this.http.get<EntityListDto[]>(this.apiUrlGateway);
  }
}
