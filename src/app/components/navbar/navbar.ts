import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { jwtDecode } from 'jwt-decode'; // Importamos el decodificador

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  private router = inject(Router);

  get isLogged(): boolean {
    return !!localStorage.getItem('token');
  }

  // Nueva función para obtener el nombre del usuario
  get username(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';
    try {
      const decoded: any = jwtDecode(token);
      return decoded.sub; // 'sub' es el estándar para el nombre de usuario en JWT
    } catch (e) {
      return '';
    }
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
