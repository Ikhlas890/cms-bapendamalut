import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from 'src/services/auth.service';
import { Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';

export const AuthGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.checkAuthFromServer().pipe(
    map(res => {
      if (res.loggedIn) return true;
      router.navigate(['/auth/login']);
      return false;
    }),
    catchError(() => {
      router.navigate(['/auth/login']);
      return of(false);
    })
  );
};
