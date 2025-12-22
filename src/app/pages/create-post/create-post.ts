import { Component, inject, OnInit } from '@angular/core';
import { PostService } from '../../services/post';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './create-post.html',
  styleUrl: './create-post.css',
})
export class CreatePost implements OnInit {
  // Inyecciones
  private postService = inject(PostService);
  private router = inject(Router);

  // Variables para el formulario
  titulo: string = '';
  contenido: string = '';
  categoriaId: number | null = null;
  categorias: any[] = [];

  ngOnInit() {
    // Cargamos las categorías al iniciar para el <select>
    this.postService.listarCategorias().subscribe({
      next: (data) => (this.categorias = data),
      error: (err) => console.error('Error al cargar categorías', err),
    });
  }
  cancelar() {
    this.router.navigate(['/']);
  }

  guardarPost() {
    if (!this.categoriaId) {
      alert('Por favor, selecciona una categoría');
      return;
    }

    const nuevoPost = {
      titulo: this.titulo,
      contenido: this.contenido,
      categoriaId: this.categoriaId,
    };

    this.postService.crearPost(nuevoPost).subscribe({
      next: () => {
        alert('Post creado con éxito');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Error al crear post:', err);
        alert('Error al guardar. Verifica si tu token expiró.');
      },
    });
  }
}
