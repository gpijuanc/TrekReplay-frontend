import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Recuperem el token de la memoria local 
  const token = localStorage.getItem('auth_token');

  // 2. Si el tenim, el clonem dins la capçalera de la petició
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  // 3. Si no, enviem la petició tal qual
  return next(req);
};