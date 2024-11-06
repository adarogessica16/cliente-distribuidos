<template>
    <div>
      <b-card title="Reseñas de Productos" sub-title="">
        <b-card-text v-if="loading">Cargando reseñas...</b-card-text>
        <b-card-text v-else-if="error">{{ error }}</b-card-text>
        
        <!-- Muestra las reseñas si están disponibles -->
        <div v-else>
          <b-card-group>
            <b-card v-for="reseña in reseñas" :key="reseña.Id_Reseña">
              <template #header>
                <strong>Producto ID: {{ reseña.Id_Producto }}</strong>
              </template>
  
              <b-card-body>
                <p><strong>Calificación:</strong> {{ reseña.calificacion }} ⭐</p>
                <p><strong>Comentario:</strong> {{ reseña.comentario }}</p>
                <p><strong>Fecha:</strong> {{ reseña.fecha }}</p>
              </b-card-body>
            </b-card>
          </b-card-group>
        </div>
      </b-card>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'ReseñasView',
    data() {
      return {
        reseñas: [],
        loading: true,
        error: null,
      };
    },
    mounted() {
      this.fetchReseñas();
    },
    methods: {
      async fetchReseñas() {
        try {
          this.loading = true;
          this.error = null;
          const token = localStorage.getItem('token');
          console.log('jwt token:', token);
          console.log(`Llamando a la URL: /api/resenhas`);
          const response = await axios.get(`/api/resenhas`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          console.log('Datos recibidos:', response.data);
          this.reseñas = response.data.content; 
        } catch (error) {
          console.log(error);
          this.handleError(error, 'No se pudieron cargar las reseñas');
        } finally {
          this.loading = false;
        }
      },
      handleError(error, mensajePredeterminado) {
        console.error('Error:', error);
        this.error = error.response?.data?.message || mensajePredeterminado;
      }
    }
  };
  </script>
  
  <style scoped>
  .reseñas-container {
    padding: 20px;
  }
  </style>
  