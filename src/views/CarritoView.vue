<template>
    <div>
      <b-container v-if="isAuthenticated">
        <NavigationCart/>
      </b-container>
      <b-container v-else>
        <p>No estás autenticado. Por favor, inicia sesión para ver tu carrito.</p>
        <router-link to="/login">Iniciar Sesión</router-link>
      </b-container>
    </div>
  </template>
  
  <script>
    import NavigationCart from  '@/components/NavigationCart.vue';
  import axios from 'axios';
  export default {
    name: 'CarritoView',
    components: {
    NavigationCart
    },
    data() {
      return {
        isAuthenticated: false,
      };
    },
    async created() {
      const token = localStorage.getItem('token');
      console.log('Verificando token: ', token); 
      this.isAuthenticated = !!token; 
      if (token) {
          try {
              const response = await axios.get('/auth/validate', {
                  headers: {
                      Authorization: `Bearer ${token}`
                  }
              });
              console.log('Respuesta del servidor: ', response.data); 
          } catch (error) {
              console.error('Token no válido o ha expirado', error);
              this.isAuthenticated = false;
              localStorage.removeItem('token'); 
              this.$router.push({ name: 'Login' });
          }
      } else {
          this.isAuthenticated = false; 
      }
  }
  };
  </script>
  