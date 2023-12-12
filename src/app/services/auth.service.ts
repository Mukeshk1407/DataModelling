import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = '';

  constructor(private http: HttpClient) {}
  
  login(username: string, password: string) {
    // Assuming your API expects the credentials as an object
    const credentials = { username, password };

    // Pass the credentials in the POST request
    return this.http.post(this.apiUrl, credentials);
  }
}
