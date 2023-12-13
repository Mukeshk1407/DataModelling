import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  
  constructor(private http: HttpClient) {}
  private logDetailsData = new BehaviorSubject<any>(null);
  data: any[] = [];
  private EditApiURL = 'https://localhost:7093';
  private ListOfTableURL = 'https://localhost:7093/api/entity/has-values';
  private EntityIdURL = 'https://localhost:7093';
  private baseUrl= 'https://localhost:7093';
  getLogDetailsData() {
    console.log(this.data);
    return this.logDetailsData.asObservable();
  }
  checkTablesHaveValues(
    tableNames: string[]
  ): Observable<{ [key: string]: boolean }> {
    return this.http.post<{ [key: string]: boolean }>(
      `${this.ListOfTableURL}`,
      tableNames
    );
  }
  setLogDetails(data: any) {
    this.logDetailsData.next(data);
    console.log(this.logDetailsData);
  }
  updateEntityColumn(data: any): Observable<any> {
    const url = `${this.EditApiURL}/updateEntityColumn`;
    return this.http.post(url, data);
  }
  getEntityIdByName(entityName: string): Observable<any> {
    const url = `${this.EntityIdURL}/getEntityIdByName/${entityName}`;
    return this.http.get(url);
  }
  getEntityData(listEntityId: number, listEntityKey: number, listEntityValue: number): Observable<any> {
    const url = `${this.baseUrl}/getEntityData?listEntityId=${listEntityId}&listEntityKey=${listEntityKey}&listEntityValue=${listEntityValue}`;
    return this.http.get(url);
  }
}
