// role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './services/auth.service';


@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];

    // Check if the user has the expected role
    const userRole = this.authService.getUserRole();
    if (userRole === expectedRole) {
      return true;
    } else {
      // Redirect to a different component or handle unauthorized access
      this.router.navigate(['/login']); // Adjust the route accordingly
      return false;
    }
  }
}
