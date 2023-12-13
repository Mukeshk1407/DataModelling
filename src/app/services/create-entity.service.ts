import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TableColumnDTO } from '../models/TableColumnDTO.model';

@Injectable({
  providedIn: 'root'
})

export class ColumnsService {
  // private apiUrl = 'https://localhost:7245/api';
  private ApiUrlGateWay = 'https://localhost:7093';

  constructor(private http: HttpClient) {}

  getColumnsForEntity(entityName: string): Observable<TableColumnDTO[]> {
    // const url = `${this.apiUrl}/entity/${entityName}/columns`;
    const url = `${this.ApiUrlGateWay}/${entityName}/columns`;
    return this.http.get<TableColumnDTO[]>(url);
  }

  generateExcelFile(columns: any[]): Observable<Blob> {
    // return this.http.post<Blob>(`${this.apiUrl}/Excel/generate`, columns, {
      return this.http.post<Blob>(`${this.ApiUrlGateWay}/generate`, columns, {
      responseType: 'blob' as 'json' 
    });
  }

  getColumnsForEntitys(entityName: string): Observable<TableColumnDTO[]> {
    const url = `${this.ApiUrlGateWay}/${entityName}/columns`;
    return this.http.get<TableColumnDTO[]>(url);
  }
  generateExcelFiles(parentId: number, columns: any[]): Observable<Blob> {
   // return this.http.post<Blob>(`${this.apiUrl}/Excel/generate?parentId=${parentId}`, columns, {
    return this.http.post<Blob>(`${this.ApiUrlGateWay}/generate?parentId=${parentId}`, columns, {
      responseType: 'blob' as 'json' 
    });
  }
  
  uploadTemplate(file: FormData, tableName: string): Observable<any> {
    const url = `${this.ApiUrlGateWay}/upload?tableName=${tableName}`;
    const options = {
      headers: new HttpHeaders(),
      responseType: 'text' as 'json'
    };
    return this.http.post(url, file, options);
  }
  setConnectionString(serverConfig: any): Observable<any> {
    const url = `${this.ApiUrlGateWay}/entity/api/setconnectionstring`;
    return this.http.post(url, serverConfig);
  }
}
