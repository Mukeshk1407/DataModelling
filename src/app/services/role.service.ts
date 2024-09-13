// role.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { Role } from '../models/Role';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class RoleService {
  private rolesSubject = new BehaviorSubject<Role[]>([]);
  roles$ = this.rolesSubject.asObservable();
  private apiUrl = 'https://localhost:7139/api/Auth'; 

  constructor(private http: HttpClient) {
    // Mock data for initial roles
    const initialRoles: Role[] = [
      { id: 1, roleName: 'Admin' },
      { id: 2, roleName: 'User' },
    ];

    this.rolesSubject.next(initialRoles);
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

  addRole(roleDTO: any): Observable<any> {
    const url = `${this.apiUrl}/createNewRole`;

    // Optional: You can set headers if needed
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // Add any other headers if necessary
    });

    return this.http.post<any>(url, roleDTO, { headers });
  }

  // removeRole(roleId: number): void {
  //   const currentRoles = this.rolesSubject.value;
  //   const updatedRoles = currentRoles.filter((role) => role.id !== roleId);
  //   this.rolesSubject.next(updatedRoles);
  // }

  editRole(roleId: number, updatedRole: Role): Observable<any> {
    const url = `${this.apiUrl}/UpdateRoleById/${roleId}`;
    return this.http.put(url, updatedRole);
  }
}
