import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { UserTableDTO } from '../models/user-table.dto';

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  private apiUrl = 'https://localhost:7138';
  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserTableDTO[]> {
    const url = `${this.apiUrl}/GetUsers`;
    return this.http.get<UserTableDTO[]>(url);
  }
  // Add this method to your UserInfoService
 // Add this method to your UserInfoService
getRoleById(roleId: number): Observable<string> {
  const url = `${this.apiUrl}/GetUserRoleById?id=${roleId}`;
  return this.http.get<string>(url);
}

  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/GetUserbyId?id=${userId}`);
  }
  getRoles(): Observable<any[]> {
    const url = `${this.apiUrl}/GetRoles`; // Adjust the endpoint based on your API
    return this.http.get<any[]>(url);
  }
  

  updateUserById(userId: number, userData: any): Observable<any> {
    const url = `${this.apiUrl}/UpdateUserbyId`;
    return this.http.put(url, userData);
  }

}
