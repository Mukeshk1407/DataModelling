import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private baseUrl = 'https://localhost:7093'; // Replace with your actual backend URL and port

  constructor(private http: HttpClient) { }
  getTableDetails( host: string, databaseName: string,username: string, password: string): Observable<any> {
    const body = {
      //selecteddbName: string,
      // dbName,
      host,
      databaseName,
      username,
      password,
    };
    console.log("dbconnection details",body);
    const endpoint = `${this.baseUrl}/GetTableDetails?Host=${host}&Database=${databaseName}&Username=${username}&Password=${password}`;

    return this.http.get<any>(endpoint).pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError('Something went wrong. Please try again later.');
      })
    );
  }
}
