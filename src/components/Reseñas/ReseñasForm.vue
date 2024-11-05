<template>
  <div class="resena-form-container">
      <h1>Deja tu Reseña</h1>
      <div v-if="loading" class="text-center">
          <b-spinner variant="primary" label="Cargando..."></b-spinner>
      </div>

      <b-container v-else>
          <b-form @submit.prevent="crearResena">
              <b-form-group label="Comentario">
                  <b-form-textarea v-model="resena.comentario" placeholder="Escribe tu comentario..." required></b-form-textarea>
              </b-form-group>

              <b-form-group label="Calificación">
                <star-rating v-model="resena.calificacion" :star-size="30"  ></star-rating>
              </b-form-group>

              <b-button type="submit" variant="primary">Enviar Reseña</b-button>
          </b-form>

          <b-alert v-if="error" variant="danger" dismissible @dismissed="error = null">
              {{ error }}
          </b-alert>
      </b-container>
  </div>
</template>

<script>
import axios from 'axios';
import StarRating from 'vue3-star-ratings';


export default {
  name: 'ReseñasForm',
  components: {
      StarRating
  },
  data() {
      return {
          resena: {
              Id_Usuario: null,  // Se puede asignar en el backend si el usuario está autenticado
              Id_Producto: null,  // Será asignado desde los parámetros de la ruta
              calificacion: 0,
              comentario: '',
              fecha: new Date().toISOString().substr(0, 10)  // Fecha actual
          },
          loading: false,
          error: null
      };
  },
  created() {
      this.resena.Id_Producto = this.$route.params.idProducto;  // Captura el ID del producto desde los parámetros de la ruta
  },
  methods: {
      async crearResena() {
          try {
              this.loading = true;
              this.error = null;
              console.log(this.resena);

              const token = localStorage.getItem('token');
              if (!token) {
                  this.error = 'No se encontró un token de autenticación. Inicia sesión nuevamente.';
                  return;
              }

              const response = await axios.post('/api/resenas', this.resena, {
                  headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`, 
                  },
              });

              console.log('Reseña enviada exitosamente:', response.data);
              this.$router.push('/resenas'); 
          } catch (error) {
              this.error = error.response?.data?.message || 'Error al enviar la reseña';
              console.error('Error al enviar la reseña:', error);
          } finally {
              this.loading = false;
          }
      }
  }
};
</script>

<style scoped>
.resena-form-container {
    padding: 20px;
}
</style>
