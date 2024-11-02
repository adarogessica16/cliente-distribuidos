// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import CategoriasView from '@/views/CategoriasView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/categorias',
    name: 'Categorias',
    component: CategoriasView,
    meta: { requiresAuth: true }
  },
  {
    path: '/categorias/:id',
    name: 'CategoriaEspecifica',
    component: CategoriasView,
    meta: { requiresAuth: true }
  }
  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Middleware para validar autenticación en rutas protegidas
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Verificación de token
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
