import { Component, inject, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post'; // Usamos tu servicio
import { RouterModule } from '@angular/router'; // <--- 1. Importar esto

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  // Inyecciones
  private postService = inject(PostService);

  // Variables
  isAdmin: boolean = false;
  posts: any[] = [];
  categorias: any[] = [];
  categoriaSeleccionada: number | null = null;

  ngOnInit() {
    this.cargarCategorias();
    this.cargarPosts();
    const role = localStorage.getItem('role');
    this.isAdmin = role === 'ADMIN';
  }

  cargarCategorias() {
    this.postService.listarCategorias().subscribe({
      next: (data) => (this.categorias = data),
      error: (err) => console.error('Error al cargar categorías:', err),
    });
  }

  // Si pasas un ID, filtra; si no, trae todos
  cargarPosts(id?: number) {
    // Si el ID es igual al seleccionado, no hacemos nada (evita doble click innecesario)
    // Pero si es 'undefined', reseteamos para mostrar todos
    this.categoriaSeleccionada = id !== undefined ? id : null;

    this.postService.listarPosts(id).subscribe({
      next: (data) => {
        this.posts = data;
      },
      error: (err) => console.error('Error al obtener posts:', err),
    });
  }

  asignarNuevaCategoria(postId: number, event: any) {
    const categoriaId = event.target.value; // Captura el ID del selector

    this.postService.actualizarCategoria(postId, categoriaId).subscribe({
      next: () => {
        alert('Categoría actualizada correctamente');
        this.cargarPosts(); // Recarga la lista para ver el cambio
      },
      error: (err) => console.error('Error al asignar categoría', err),
    });
  }

  crearCategoria(nombre: string) {
    if (!nombre.trim()) {
      alert('El nombre no puede estar vacío');
      return;
    }
    this.postService.crearCategoria(nombre, '').subscribe({
      next: () => {
        alert('Categoría creada con éxito');
        this.cargarCategorias(); // Para que aparezca el nuevo botón de filtro arriba
      },
      error: (err) => {
        console.error('Error al crear categoría:', err);
        alert('No se pudo crear la categoría. Verifica tus permisos.');
      },
    });
  }
}
