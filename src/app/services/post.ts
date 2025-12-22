// services/post.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostService {
  private apiUrl = 'http://localhost:8080/api/posts';
  private catUrl = 'http://localhost:8080/api/categorias'; // Verifica que este endpoint exista

  constructor(private http: HttpClient) {}

  // Listar con filtro opcional
  listarPosts(categoriaId?: number): Observable<any[]> {
    const url = categoriaId ? `${this.apiUrl}?categoriaId=${categoriaId}` : this.apiUrl;
    return this.http.get<any[]>(url);
  }

  // Crear post enviando el categoriaId (DTO que definimos en Java)
  crearPost(postData: { titulo: string; contenido: string; categoriaId: number }): Observable<any> {
    return this.http.post<any>(this.apiUrl, postData);
  }

  // Obtener categorías para los selects
  listarCategorias(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/categorias');
  }

  crearCategoria(nombre: string, descripcion: string): Observable<any> {
    return this.http.post('http://localhost:8080/api/categorias', {
      nombre,
      descripcion,
    });
  }

  obtenerPostPorId(id: number): Observable<any> {
    console.log('Llamando a la API para ID:', id);
    return this.http.get(`http://localhost:8080/api/posts/${id}`);
  }

  eliminarPost(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  eliminarComentario(id: number): Observable<any> {
    return this.http.delete(`http://localhost:8080/api/comentarios/${id}`);
  }
  comentar(postId: number, contenido: string): Observable<any> {
    const body = { postId: postId, contenido: contenido };
    return this.http.post(`http://localhost:8080/api/comentarios`, { postId, contenido });
  }

  actualizarCategoria(postId: number, categoriaId: number): Observable<any> {
    return this.http.put(`http://localhost:8080/api/posts/${postId}/categoria/${categoriaId}`, {});
  }
}
