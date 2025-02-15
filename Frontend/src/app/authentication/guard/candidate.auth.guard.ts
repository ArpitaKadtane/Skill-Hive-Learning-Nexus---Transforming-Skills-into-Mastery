import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const candidateRouteGuard: CanActivateFn = (route, state) => {
    const authService=inject(AuthService);
    if (authService.isAuthenticated()!==null && authService.isAuthenticated().user == 'users') {
        return true;
    } else {
        const router = inject(Router);
        router.navigate(['login']);
        return false;
    }
};