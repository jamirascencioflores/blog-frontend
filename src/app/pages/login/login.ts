import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule], // <--- No olvidar
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  // O LoginComponent

  authService = inject(AuthService);
  router = inject(Router);

  credenciales = {
    username: '',
    password: '',
  };
  
  ingresar() {
    this.authService.login(this.credenciales).subscribe({
      next: (res: any) => {
        console.log('Respuesta login:', res); // <--- aquí ves qué llega

        // Guardar token
        localStorage.setItem('token', res.token);

        // Extraemos el rol del array roles dentro del JWT
        const payload = JSON.parse(atob(res.token.split('.')[1]));
        const rolesArray = payload.roles || ['ROLE_USER'];
        const role = rolesArray[0].replace('ROLE_', ''); // toma el primer rol y quita "ROLE_"
        localStorage.setItem('role', role);

        this.router.navigate(['/']);
      },
      error: (err) => alert('Credenciales incorrectas'),
    });
  }
}
