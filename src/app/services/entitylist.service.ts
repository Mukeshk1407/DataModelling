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
    var databaseDetailsString = localStorage.getItem('databaseDetails');
    // Parse the JSON string into an object
    var databaseDetails1 = JSON.parse(databaseDetailsString || '{}');

    // Extract individual values from the object
    var host = databaseDetails1?.hostname || '';
    var databaseName = databaseDetails1?.databaseName || '';
    var username = databaseDetails1?.username || '';
    var password = databaseDetails1?.password || '';
    
    return this.http.get<EntityListDto[]>(`${this.apiUrlGateway}?HostName=${host}&DatabaseName=${databaseName}&ProviderName=${username}'`);
  }
}
