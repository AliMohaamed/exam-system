
// src/app/guards/role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate, CanActivateChild {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkRole(route);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.checkRole(route);
  }

private checkRole(route: ActivatedRouteSnapshot): boolean {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // خذ roles من الـ route أو من الـ parent
  const allowedRoles = route.data['roles'] || route.parent?.data['roles'];

  if (!allowedRoles || allowedRoles.length === 0) {
    console.warn('⚠️ لا يوجد roles معرفة في الـ route');
    this.router.navigate(['/auth/login']);
    return false;
  }

  if (user && user.role && allowedRoles.includes(user.role)) {
    return true;
  }

  this.router.navigate(['/auth/login']);
  return false;
}
}
