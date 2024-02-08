import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DBConnectionDTO } from '../models/DBConnectionDTO';
import { ColumnDTO } from '../models/ColumnDTO';

@Injectable({
  providedIn: 'root'
})

export class ExcelService {
  private ApiUrlGateWay = 'https://localhost:7216';

  constructor(private http: HttpClient) { }

  //generate
  generateExcelFile(columns: any[]): Observable<Blob> {

    return this.http.post<Blob>(`${this.ApiUrlGateWay}/generate`, columns, {
      responseType: 'blob' as 'json'
    });
  }

  //export
  ExportExcelFiles(parentId: number, columns: ColumnDTO[]): Observable<Blob> {
    return this.http.post<Blob>(`${this.ApiUrlGateWay}/generate?logId=${parentId}`, columns, {
      responseType: 'blob' as 'json'
    });
  }

  uploadTemplate(file: FormData, tableName: string): Observable<any> {
    const databaseDetailsString = localStorage.getItem('databaseDetails');
    const databaseDetails1 = JSON.parse(databaseDetailsString || '{}');

    const connectionDTO: DBConnectionDTO = {
      Provider: databaseDetails1?.provider || '',
      HostName: databaseDetails1?.hostname || '',
      DataBase: databaseDetails1?.databaseName || '',
      UserName: databaseDetails1?.username || '',
      Password: databaseDetails1?.password || ''
    };

    const url = `${this.ApiUrlGateWay}/upload`;
    
    const paramsObject = this.convertToParamsObject(connectionDTO);
    const params = new HttpParams({ fromObject: { ...paramsObject, tableName } });

    const options = {
      headers: new HttpHeaders(),
      params,
      responseType: 'text' as 'json'
    };
    
    return this.http.post(url, file, options);
  }

  private convertToParamsObject(dto: DBConnectionDTO): { [param: string]: string } {
    const paramsObject: { [param: string]: string } = {};
    for (const key in dto) {
      if (dto.hasOwnProperty(key)) {
        paramsObject[key] = dto[key]?.toString() || '';
      }
    }
    return paramsObject;
  }
}
