import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  private apiUrl = 'https://localhost:7138'; // Replace with your API endpoint

  constructor(private http: HttpClient) { }

  getRoles(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getRoleIdsAndNames`);
  }
}
