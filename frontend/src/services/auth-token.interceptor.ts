import { HttpInterceptorFn } from '@angular/common/http';
import { API_BASE_URL } from './api.config';

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const isApiRequest = req.url.startsWith(API_BASE_URL);

  if (!token || !isApiRequest || req.headers.has('Authorization')) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  );
};
