import { Routes } from '@angular/router';

// Usamos los nombres de clase cortos (Home, Login, etc.)
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
  { path: 'create', component: CreatePost },
  { path: '**', redirectTo: '' },
];
