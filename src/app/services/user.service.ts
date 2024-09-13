import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { JWTTokenService } from './jwttocken.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://localhost:7139/api/Auth'; 
  private isAuthenticatedFlag = false;
  private userRole: string | null = null;

  constructor(private http: HttpClient, private jwtTokenService: JWTTokenService) {}
  
  login(username: string, password: string): Observable<any> {
    const credentials = { Email: username, Password: password };
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response.isSuccess) {
          const token = response.result;
          this.userRole = this.jwtTokenService.getRole(token.toString());
          this.isAuthenticatedFlag = true;
        }
      }),
      catchError((error) => {
        return throwError(error);
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

  createUser(userModel: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/createUser`, userModel).pipe(
      tap((response) => {
        // Handle create user response if needed
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetUsers`).pipe(
      tap((response) => {
        // Handle get users response if needed
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetUserbyId?id=${id}`).pipe(
      tap((response) => {
        // Handle get user by id response if needed
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  getUsersByRoleId(roleId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetUserbyRoleId?Roleid=${roleId}`).pipe(
      tap((response) => {
        // Handle get users by role id response if needed
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  updateUserById(userModel: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/UpdateUserbyId`, userModel).pipe(
      tap((response) => {
        // Handle update user by id response if needed
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  getRoles(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getRoles`).pipe(
      tap((response) => {
        // Handle get roles response if needed
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  getRoleById(roleId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getRoleById?roleID=${roleId}`).pipe(
      tap((response) => {
        // Handle get role by id response if needed
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }
}
