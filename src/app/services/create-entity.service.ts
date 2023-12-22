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

  constructor(private http: HttpClient) { }

  getColumnsForEntity(entityName: string): Observable<TableColumnDTO[]> {

    const url = `${this.ApiUrlGateWay}/${entityName}/columns`;
    return this.http.get<TableColumnDTO[]>(url);
  }

  //generate
  generateExcelFile(columns: any[]): Observable<Blob> {
    // Retrieve the databaseDetails JSON string from session storage
    var databaseDetailsString = localStorage.getItem('databaseDetails');
    // Parse the JSON string into an object
    var databaseDetails1 = JSON.parse(databaseDetailsString || '{}');

    // Extract individual values from the object
    var host = databaseDetails1?.hostname || '';
    var databaseName = databaseDetails1?.databaseName || '';
    var username = databaseDetails1?.username || '';
    var password = databaseDetails1?.password || '';
    // return this.http.post<Blob>(`${this.apiUrl}/Excel/generate`, columns, {
    return this.http.post<Blob>(`${this.ApiUrlGateWay}/generate?Host=${host}&Database=${databaseName}&Username=${username}&Password=${password}`, columns, {
      responseType: 'blob' as 'json'
    });
  }

  getColumnsForEntitys(entityName: string): Observable<TableColumnDTO[]> {
    const url = `${this.ApiUrlGateWay}/${entityName}/columns`;
    return this.http.get<TableColumnDTO[]>(url);
  }

  //export
  generateExcelFiles(parentId: number, columns: any[]): Observable<Blob> {

    // Retrieve the databaseDetails JSON string from session storage
    var databaseDetailsString = localStorage.getItem('databaseDetails');
    // Parse the JSON string into an object
    var databaseDetails1 = JSON.parse(databaseDetailsString || '{}');

    // Extract individual values from the object
    var host = databaseDetails1?.hostname || '';
    var databaseName = databaseDetails1?.databaseName || '';
    var username = databaseDetails1?.username || '';
    var password = databaseDetails1?.password || '';

    // return this.http.post<Blob>(`${this.apiUrl}/Excel/generate?parentId=${parentId}`, columns, {
    return this.http.post<Blob>(`${this.ApiUrlGateWay}/generate?parentId=${parentId}&Host=${host}&Database=${databaseName}&Username=${username}&Password=${password}`, columns, {
      responseType: 'blob' as 'json'
    });
  }

  uploadTemplate(file: FormData, tableName: string): Observable<any> {

    // Retrieve the databaseDetails JSON string from session storage
    var databaseDetailsString = localStorage.getItem('databaseDetails');
    // Parse the JSON string into an object
    var databaseDetails1 = JSON.parse(databaseDetailsString || '{}');

    // Extract individual values from the object
    var host = databaseDetails1?.hostname || '';
    var databaseName = databaseDetails1?.databaseName || '';
    var username = databaseDetails1?.username || '';
    var password = databaseDetails1?.password || '';

    const url = `${this.ApiUrlGateWay}/upload?tableName=${tableName}&Host=${host}&Database=${databaseName}&Username=${username}&Password=${password}`;
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
