import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthStorageService {
  private readonly STORAGE_KEY = 'authInfo';

  setAuthInfo(loggedIn: boolean, token: string, username: string, email: string, role: string): void {
    const authInfo = { loggedIn, token, username, email, role };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authInfo));
  }

  getAuthInfo(): { loggedIn: boolean; token: string; username: string; email: string; role: string } | null {
    const storedAuthInfo = localStorage.getItem(this.STORAGE_KEY);
    return storedAuthInfo ? JSON.parse(storedAuthInfo) : null;
  }

  clearAuthInfo(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
