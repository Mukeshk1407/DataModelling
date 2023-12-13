import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7093'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}
  
  login(username: string, password: string): Observable<any> {
    const credentials = { email: username, password }; // Make sure your API expects "email" instead of "username"

    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        // If login is successful, you can perform additional actions here
        console.log('Login successful:', response);
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        return throwError('Authentication failed. Please check your credentials.');
      })
    );
  }
}
