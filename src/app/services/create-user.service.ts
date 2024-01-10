import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CreateUserService {
  private apiUrl = 'https://localhost:7138'; // Replace with your actual API endpoint

  constructor(private http : HttpClient) { }

  createUser(userModel: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/createUser`, userModel)
      .pipe(
        catchError(error => {
          throw error; // Rethrow the error to propagate it to the component
        })
      );
  }
  
}
