import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // O "Auth" si el archivo se llama auth.ts

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/auth';

  // 1. Registro
  register(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, usuario);
  }

  // 2. Login (y guarda el token automáticamente si sale bien)
  login(credenciales: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credenciales).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
      })
    );
  }

  // 3. Cerrar sesión
  logout() {
    localStorage.removeItem('token');
  }

  // 4. Verificar si estoy logueado
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
