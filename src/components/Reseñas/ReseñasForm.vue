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
                  <star-rating v-model="resena.calificacion" :star-size="30"></star-rating>
                  <p>Calificación seleccionada: {{ resena.calificacion }}</p>
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
                idProducto: this.$route.params.idProducto,  
                calificacion: 0,
                comentario: '',
                fecha: new Date().toISOString().substr(0, 10)
            },
            loading: false,
            error: null
        };
    },
    methods: {
        async crearResena() {
    try {
        this.loading = true;
        this.error = null;
        console.log('Reseña antes de envío:', this.resena); 
        this.resena.calificacion = Math.round(this.resena.calificacion);
        console.log('Calificación redondeada:', this.resena.calificacion);
        console.log('ID del producto recibido:', this.$route.params.idProducto);
        this.resena.Id_Producto = this.$route.params.idProducto;

        const token = localStorage.getItem('token');
        if (!token) {
            this.error = 'No se encontró un token de autenticación. Inicia sesión nuevamente.';
            console.error('No se encontró token en localStorage');
            return;
        }

        console.log('Token encontrado:', token);

        const response = await axios.post('/api/resenhas', this.resena, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        console.log('Respuesta de la API:', response.data);
        this.$router.push('/productos'); 
    } catch (error) {
        this.error = error.response?.data?.message || 'Error al enviar la reseña';
        console.error('Error al enviar la reseña:', error.response ? error.response.data : error);
    } finally {
        this.loading = false;
    }
}

    }
};
</script>
