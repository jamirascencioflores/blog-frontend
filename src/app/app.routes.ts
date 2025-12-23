import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core'; // Necesario para usar el Router dentro del Guard

// Importación de tus componentes
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { CreatePost } from './pages/create-post/create-post';
import { PostDetail } from './pages/post-detail/post-detail';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'post/:id', component: PostDetail },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: 'create',
    component: CreatePost,
    // --- Lógica del Guard integrada ---
    canActivate: [
      () => {
        const token = localStorage.getItem('token');
        const router = inject(Router);
        // Si existe el token permitimos el acceso, si no, redirigimos al login
        return token ? true : router.navigate(['/login']);
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
