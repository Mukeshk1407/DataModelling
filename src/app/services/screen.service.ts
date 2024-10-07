import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { Screen } from '../models/Screen';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ScreenService {
  private screensSubject = new BehaviorSubject<Screen[]>([]);
  screens$ = this.screensSubject.asObservable();
  private apiUrl = 'https://localhost:7139/api/Auth';

  constructor(private http: HttpClient) {
    // You can initialize screens with mock data if needed
    // const initialScreens: Screen[] = [
    //   { id: 1, screenName: 'Dashboard' },
    //   { id: 2, screenName: 'Reports' },
    // ];
    // this.screensSubject.next(initialScreens);
  }

  getScreens(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getScreens`).pipe(
      tap((response) => {
        // Handle get screens response if needed
        this.screensSubject.next(response.result);
      }),
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  addScreen(screenDTO: any): Observable<any> {
    const url = `${this.apiUrl}/createNewScreen`;

    // Optional: You can set headers if needed
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // Add any other headers if necessary
    });

    return this.http.post<any>(url, screenDTO, { headers });
  }

  editScreen(screenId: number, updatedScreen: Screen): Observable<any> {
    const url = `${this.apiUrl}/UpdateScreenById/${screenId}`;
    return this.http.put(url, updatedScreen);
  }
}
