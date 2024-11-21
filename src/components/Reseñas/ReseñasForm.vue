<template>
    <div class="resena-form-container">
      <h1>{{ isEditing ? 'Editar Reseña' : 'Deja tu Reseña' }}</h1>
      <div v-if="loading" class="text-center">
        <b-spinner variant="primary" label="Cargando..."></b-spinner>
      </div>
  
      <b-container v-else>
        <b-form @submit.prevent="crearResena">
          <b-form-group label="Comentario">
            <b-form-textarea
              v-model="resena.comentario"
              placeholder="Escribe tu comentario..."
              required
            ></b-form-textarea>
          </b-form-group>
  
          <b-form-group label="Calificación">
            <star-rating v-model="resena.calificacion" :star-size="30"></star-rating>
            <p>Calificación seleccionada: {{ resena.calificacion }}</p>
          </b-form-group>
  
          <b-button type="submit" variant="primary">
            {{ isEditing ? 'Guardar Cambios' : 'Enviar Reseña' }}
          </b-button>
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
        id: null, 
        idProducto: this.$route.params.idProducto, 
        calificacion: 0,
        comentario: '',
        fecha: new Date().toISOString().substr(0, 10),
      },
      loading: false,
      error: null,
      isEditing: false, 
    };
  },
  async mounted() {
    if (this.$route.params.idResena) {
      this.isEditing = true;
      await this.cargarResena();
    }
  },
  methods: {
    async cargarResena() {
      try {
        this.loading = true;
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/resenhas/${this.$route.params.idResena}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.resena = {
          id: response.data.id,
          idProducto: response.data.idProducto,
          calificacion: response.data.calificacion,
          comentario: response.data.comentario,
          fecha: response.data.fecha,
        };
      } catch (error) {
        console.error('Error al cargar la reseña:', error);
        this.error = 'No se pudo cargar los datos de la reseña.';
      } finally {
        this.loading = false;
      }
    },
    async crearResena() {
      try {
        this.loading = true;
        this.error = null;

        const token = localStorage.getItem('token');
        if (!token) {
          this.error = 'No se encontró un token de autenticación. Inicia sesión nuevamente.';
          return;
        }

        const endpoint = this.isEditing? `/api/resenhas/${this.resena.id}` : '/api/resenhas'; 

        const method = this.isEditing ? 'put' : 'post';

        const response = await axios({
          method,
          url: endpoint,
          data: this.resena,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Respuesta de la API:', response.data);

       
        this.$router.push('/productos');
      } catch (error) {
        this.error = error.response?.data?.message || 'Error al enviar la reseña';
        console.error('Error al enviar la reseña:', error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

  
  <style scoped>
  .resena-form-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
  }
  </style>
  