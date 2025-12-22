import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <--- IMPORTANTE para los inputs
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth'; // Revisa la ruta

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule], // <--- Agregarlo aquí
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  // O RegisterComponent

  authService = inject(AuthService);
  router = inject(Router);

  // Modelo de datos del formulario
  usuario = {
    username: '',
    email: '',
    password: '',
  };

  registrar() {
    this.authService.register(this.usuario).subscribe({
      next: (res) => {
        alert('¡Usuario registrado con éxito!');
        this.router.navigate(['/login']); // Redirigir al login
      },
      error: (err) => {
        alert('Error al registrar: ' + err.message);
      },
    });
  }
}
