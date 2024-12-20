// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import CarritoView from '@/views/CarritoView.vue'
import PedidoForm from '@/components/PedidoForm.vue'
import PedidoLista from '@/components/listaPedidos.vue'
import ProductoDetalle from '@/components/Producto/ProductoDetalle.vue';
import ProductoList from '@/components/Producto/ProductoList.vue';
import CategoriaList from '@/components/Categoria/CategoriaList.vue';
import ReseñasForm from '@/components/Reseñas/ReseñasForm.vue';
import InventarioDetalles from '@/components/Inventario/InventarioDetalles.vue';
import InventarioForm from '@/components/Inventario/InventarioForm.vue';
import FormasPagoView from '@/views/FormasPagoView.vue';
import RegisterView from '@/views/RegisterView.vue';

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
    path: '/register',
    name: 'Register',
    component: RegisterView,  // Ruta para el registro
    meta: { requiresAuth: false } // No requiere autenticación para acceder
  },
  {
    path: '/categorias',
    name: 'Categorias',
    component: CategoriaList,
    meta: { requiresAuth: true }
  },
  {
    path: '/productos',
    name: 'Productos',
    component: ProductoList,
    meta: { requiresAuth: true }
  },
  {
    path: '/producto/:id',
    name: 'ProductoDetalles',
    component: ProductoDetalle,
    meta: { requiresAuth: true }
  },
  {
    path: '/pedidos',
    name: 'pedidos',
    component: CarritoView,
    meta: { requiresAuth: true }
  },
  {
    path: '/obtener-pedidos',
    name: 'ListaPedidos',
    component: PedidoLista,
    meta: { requiresAuth: true }
  },
  {
    path: '/crear-pedido',
    name: 'CrearPedido',
    component: PedidoForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/crear-reseña/:idProducto',
    name: 'CrearReseña',
    component: ReseñasForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/inventarios/:id',
    name: 'InventarioDetalles',
    component: InventarioDetalles,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/inventarios',
    name: 'Inventarios',
    component: InventarioForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/formas-pago',
    name: 'FormasPago',
    component: FormasPagoView,
    meta: { requiresAuth: true }
  },
  {
    path: '/editar-resena/:idResena/:idProducto',
    name: 'resena-edit',
    component: ReseñasForm,  
    meta: { requiresAuth: true }  
  }  
  
];

const router = createRouter({
  history: createWebHistory('/cliente-distribuidos/'),
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
