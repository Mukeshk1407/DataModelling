import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Screen } from '../models/Screen';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {

   // Define the URL of your .NET API
  apiUrl = 'https://localhost:7139/api/Auth/';

  constructor(private http: HttpClient) { }

  getList(): Observable<Screen[]> {
    const url = `${this.apiUrl}GetRoleScreens`; // Construct the complete URL
    console.log("Request URL:", url); // Log the constructed URL for debugging
  
    // Make the HTTP GET request to the constructed URL
    return this.http.get<{ result: Screen[] }>(url).pipe(
      map(response => response.result) // Extract the 'result' array from the response
     
    );
    
  }
  
}
