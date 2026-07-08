import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from 'src/services/auth.service';
import { Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';

export const NoAuthGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.checkAuthFromServer().pipe(
    map(res => {
      if (res.loggedIn) {
        router.navigate(['/dashboard']);
        return false;
      }
      return true;
    }),
    catchError(() => of(true)) // kalau error (misal belum login), tetap lanjut ke /login
  );
};
