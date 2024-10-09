import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ScreenmappingService {
  private apiUrl = 'https://localhost:7139/api/Auth';

  constructor(private http: HttpClient) {}

  getRoles(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getRoles`).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  getScreens(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getScreens`).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  getRoleScreens(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetRoleScreens`).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }
}
