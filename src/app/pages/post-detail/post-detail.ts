import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PostService } from '../../services/post';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './post-detail.html',
})
export class PostDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private postService = inject(PostService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  post: any = null;
  nuevoComentario: string = '';

  ngOnInit() {
    this.cargarDetallePost();
  }

  // --- 2. LÓGICA DE PERMISOS (Lo que faltaba) ---
  get username(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';
    try {
      const decoded: any = jwtDecode(token);
      return decoded.sub;
    } catch (e) {
      return '';
    }
  }

  get isAdmin(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const decoded: any = jwtDecode(token);
      // Verificamos si existe el array 'roles' y si contiene el rol de admin
      return decoded.roles && decoded.roles.includes('ROLE_ADMIN');
    } catch (e) {
      return false;
    }
  }

  puedoEliminarPost(): boolean {
    if (!this.post) return false;
    return this.isAdmin || this.post.autor?.username === this.username;
  }

  puedoEliminarComentario(autorComentario: string): boolean {
    if (!this.post) return false;
    // Admin O autor del comentario O dueño del Post
    return (
      this.isAdmin ||
      autorComentario === this.username ||
      this.post.autor?.username === this.username
    );
  }
  // ----------------------------------------------

  cargarDetallePost() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.postService.obtenerPostPorId(+id).subscribe({
        next: (data) => {
          this.post = data;

          // --- AGREGA ESTO PARA DEPURAR ---
          console.log('=== PRUEBA DE PERMISOS ===');
          console.log('Usuario logueado (Token):', this.username);
          console.log('Objeto Post recibido:', this.post);
          console.log('Nombre del autor del post:', this.post.autor?.username);
          console.log('¿Son iguales?:', this.post.autor?.username === this.username);
          // --------------------------------

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al cargar post:', err);
          this.post = null;
          this.cdr.detectChanges();
        },
      });
    }
  }

  enviarComentario() {
    // 1. Validar que el comentario no esté vacío
    if (!this.nuevoComentario.trim()) return;

    // 2. Verificar si el usuario está autenticado
    const token = localStorage.getItem('token');

    if (!token) {
      // Si no hay token, lo mandamos al login
      alert('Debes iniciar sesión para comentar.');
      this.router.navigate(['/login']);
      return;
    }

    // 3. Si hay token, procedemos con la lógica normal
    this.postService.comentar(this.post.id, this.nuevoComentario).subscribe({
      next: () => {
        this.nuevoComentario = '';
        this.cargarDetallePost();
      },
      error: (err: any) => {
        if (err.status === 403 || err.status === 401) {
          alert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
          this.router.navigate(['/login']);
        } else {
          alert('Error al enviar el comentario.');
        }
      },
    });
  }

  borrarComentario(id: number) {
    if (confirm('¿Eliminar comentario?')) {
      this.postService.eliminarComentario(id).subscribe({
        next: () => this.cargarDetallePost(),
        error: (err: any) => alert('No tienes permiso para borrar este comentario.'),
      });
    }
  }

  eliminarPost() {
    if (confirm('¿Eliminar esta publicación?')) {
      this.postService.eliminarPost(this.post.id).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err: any) => alert('Error al eliminar'),
      });
    }
  }
}
