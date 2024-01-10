import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { JWTTokenService } from './jwttocken.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7093'; 
  private isAuthenticatedFlag = false;
  private userRole: string | null = null;

  constructor(private http: HttpClient, private jwtTokenService: JWTTokenService) {}
  
  login(username: string, password: string): Observable<any> {
    const credentials = { email: username, password };

    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response.isSuccess) {
          const token = response.result;
          // Store user role (modify this based on your actual response structure)
          this.userRole = this.jwtTokenService.getRole(token.toString());
          // Set the authentication flag
          this.isAuthenticatedFlag = true;
        } else {
          // Handle login failure
        }
      }),
      catchError((error) => {
        return throwError('Authentication failed. Please check your credentials.');
      })
    );
  }

  // Method to check if the user is authenticated
  isAuthenticated(): boolean {
    return this.isAuthenticatedFlag;
  }

  // Method to get the user role
  getUserRole(): string | null {
    return this.userRole;
}

}
