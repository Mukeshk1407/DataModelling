import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ColumnInputServiceService {
   private ApiUrlGateWay = 'https://localhost:7254';

  constructor(private http: HttpClient) { }
  
  getDataFromBackend(): Observable<any> {
    return this.http.get<any>(`${this.ApiUrlGateWay}/your-endpoint`);
  }

  createTable(request: any): Observable<any> {
    var databaseDetailsString = localStorage.getItem('databaseDetails');
    // Parse the JSON string into an object
    var databaseDetails1 = JSON.parse(databaseDetailsString || '{}');

    // Extract individual values from the object
    var host = databaseDetails1?.hostname || '';
    var databaseName = databaseDetails1?.databaseName || '';
    var username = databaseDetails1?.username || '';
    var password = databaseDetails1?.password || '';
    var provider = databaseDetails1?.selectedContent;
    return this.http.post<any>(`${this.ApiUrlGateWay}/create-table`, request)
      .pipe(
        catchError(error => {
          let errorMessage = 'An error occurred while creating the table.';
          if (error.error && error.error.errorMessage && error.error.errorMessage.length > 0) {
            errorMessage = error.error.errorMessage[0]; 
          }
          return throwError(errorMessage);
        })
      );
  }
}
