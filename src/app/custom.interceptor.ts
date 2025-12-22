import { HttpInterceptorFn } from '@angular/common/http';

export const customInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Obtener el token del localStorage
  const token = localStorage.getItem('token');

  // 2. Si existe el token, clonamos la petición y le inyectamos el header
  if (token) {
    const reqWithToken = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    // 3. Pasamos la petición clonada (con token)
    return next(reqWithToken);
  }

  // 4. Si no hay token, pasamos la petición tal cual
  return next(req);
};
