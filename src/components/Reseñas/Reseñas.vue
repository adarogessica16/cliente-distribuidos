<template>
  <div>
    <b-card title="Reseñas de Productos" sub-title="">
      <b-card-text v-if="loading">Cargando reseñas...</b-card-text>
      <b-card-text v-else-if="error">{{ error }}</b-card-text>

      <div v-else>
        <b-alert v-if="!reseñas.length" show variant="info">
          Este producto aún no tiene reseñas. ¡Sé el primero en valorarlo!
        </b-alert>

        <b-card-group v-else>
          <b-card v-for="reseña in reseñas" :key="reseña.id">
            <template #header>
              <div class="d-flex justify-content-end">
                <i class="bi bi-pencil-fill me-2" 
                   @click="editarReseña(reseña)" 
                   role="button"></i>
                <i class="bi bi-trash-fill" 
                   @click="confirmarEliminar(reseña)" 
                   role="button"></i>
              </div>
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

    <b-modal 
      v-model="isEliminarModalVisible" 
      title="Confirmar Eliminación" 
      @ok="eliminarReseña"
      ok-title="Eliminar" 
      cancel-title="Cancelar">
      <p>¿Está seguro que desea eliminar esta reseña?</p>
      <p v-if="reseñaAEliminar?.comentario" class="font-italic">
        "{{ reseñaAEliminar.comentario }}"
      </p>
    </b-modal>

    <b-toast v-model="toastVisible" :variant="toastVariant" auto-hide-delay="3000" solid>
      {{ toastMessage }}
    </b-toast>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ReseñasView',
  props: {
    productoId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      reseñas: [],
      loading: true,
      error: null,
      reseñaAEliminar: null,
      isEliminarModalVisible: false,
      toastVisible: false,
      toastMessage: '',
      toastVariant: 'success'
    };
  },
  watch: {
    productoId: 'fetchReseñas'
  },
  methods: {
    async fetchReseñas() {
      if (!this.productoId) return;

      try {
        this.loading = true;
        this.error = null;
        const token = localStorage.getItem('token');
        
        const response = await axios.get(`/api/resenhas/producto/${this.productoId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(response.data)
        this.reseñas = Array.isArray(response.data) ? response.data :
                       response.data?.content ? response.data.content :
                       typeof response.data === 'object' ? [response.data] : [];

      } catch (error) {
        this.handleError(error, 'Error al cargar las reseñas');
      } finally {
        this.loading = false;
      }
    },

    confirmarEliminar(reseña) {
      if (!reseña || !reseña.id) {
        console.error('Reseña recibida:', reseña);
        this.mostrarError('Error: No se puede identificar la reseña a eliminar');
        return;
      }
      
      this.reseñaAEliminar = { ...reseña };
      this.isEliminarModalVisible = true;
    },

    async eliminarReseña() {
      if (!this.reseñaAEliminar?.id) {
        this.mostrarError('Error: ID de reseña no válido');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/api/resenhas/${this.reseñaAEliminar.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        this.mostrarExito('Reseña eliminada exitosamente');
        await this.fetchReseñas();
      } catch (error) {
        console.error('Error al eliminar:', error);
        this.handleError(error, 'Error al eliminar la reseña');
      } finally {
        this.isEliminarModalVisible = false;
        this.reseñaAEliminar = null;
      }
    },

    editarReseña(reseña) {
      if (reseña && reseña.id) {
        // Redirigir al formulario de edición, pasando el id de la reseña
        this.$router.push({ name: 'resena-edit', params: { idResena: reseña.id, idProducto: this.productoId } });
      } else {
        this.mostrarError('No se pudo identificar la reseña para editar');
      }
    },

    mostrarExito(mensaje) {
      this.toastMessage = mensaje;
      this.toastVariant = 'success';
      this.toastVisible = true;
    },

    mostrarError(mensaje) {
      this.toastMessage = mensaje;
      this.toastVariant = 'danger';
      this.toastVisible = true;
    },

    handleError(error, mensajePredeterminado) {
      console.error('Error detallado:', error);
      
      const mensaje = error.response?.status === 401 ? 'Sesión expirada o no autorizada. Por favor, inicie sesión nuevamente.' :
                     error.response?.status === 403 ? 'No tiene permisos para ver las reseñas.' :
                     error.response?.data?.message || 
                     error.request ? 'No se pudo conectar con el servidor. Por favor, verifique su conexión.' :
                     mensajePredeterminado;
      
      this.mostrarError(mensaje);
    }
  },
  mounted() {
    this.fetchReseñas();
  }
};
</script>

<style scoped>
.b-card-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.b-card {
  flex: 1;
  min-width: 300px;
}

.alert {
  text-align: center;
  margin: 1rem 0;
}

.bi {
  cursor: pointer;
  padding: 0.25rem;
}

.bi:hover {
  opacity: 0.7;
}
</style>