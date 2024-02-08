import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class SharedDataService {

  private baseUrl = 'https://localhost:7046/EntitySchema';
  
  constructor(private http: HttpClient) {}
  private logDetailsData = new BehaviorSubject<any>(null);
  data: any[] = [];
  
  getLogDetailsData() {
    return this.logDetailsData.asObservable();
  }
 
  setLogDetails(data: any) {
    this.logDetailsData.next(data);
  }

  getLogByParentId(logParentId: number): Observable<any> {
    const url = `${this.baseUrl}/log/${logParentId}`;
    return this.http.get(url);
  }

  getLogByChildId(logChildId: number): Observable<any> {
    const url = `${this.baseUrl}/log/child/${logChildId}`;
    return this.http.get(url);
  }

  getAllLogs(): Observable<any> {
    const url = `${this.baseUrl}/logs`;
    return this.http.get(url);
  }

  getLogsByUserId(userId: number): Observable<any> {
    const url = `${this.baseUrl}/logs/user/${userId}`;
    return this.http.get(url);
  }

  getLogsByEntityId(entityId: number): Observable<any> {
    const url = `${this.baseUrl}/logs/entity/${entityId}`;
    return this.http.get(url);
  }
}
