<template>
  <div class="formas-pago-container">
      <h1>Formas de Pago</h1>

      <!-- Botones de Acción -->
      <div class="d-flex justify-content-between mb-3">
          <b-button variant="primary" @click="mostrarModalCrear">
              Crear Forma de Pago
          </b-button>
          <b-button variant="success" v-if="formaPagoSeleccionada" @click="editarFormaPago">
              Editar
          </b-button>
          <b-button variant="danger" v-if="formaPagoSeleccionada" @click="confirmarEliminar">
              Eliminar
          </b-button>
      </div>

      <!-- Tabla de Formas de Pago -->
      <b-table striped hover :items="formasPago" :fields="columns">
          <template #cell(acciones)="row">
              <b-button size="sm" variant="info" @click="seleccionarFormaPago(row.item)">
                  Seleccionar
              </b-button>
          </template>
      </b-table>

      <!-- Modal de Creación/Edición de Forma de Pago -->
      <b-modal v-model="isModalVisible" :title="modoEdicion ? 'Editar Forma de Pago' : 'Nueva Forma de Pago'"
          @ok="guardarFormaPago" ok-title="Guardar" cancel-title="Cancelar">
          <b-form>
              <b-form-group label="Nombre de la Forma de Pago">
                  <b-form-input v-model="formaPagoActual.nombre" required placeholder="Ingrese el nombre de la forma de pago" />
              </b-form-group>
          </b-form>
      </b-modal>

      <!-- Modal de Confirmación de Eliminación -->
      <b-modal v-model="isEliminarModalVisible" title="Confirmar Eliminación" @ok="eliminarFormaPago"
          ok-title="Eliminar" cancel-title="Cancelar">
          ¿Está seguro que desea eliminar la forma de pago "{{ formaPagoAEliminar.nombre }}"?
      </b-modal>

      <!-- Toast de Notificación -->
      <b-toast v-model="toastVisible" :variant="toastVariant" auto-hide-delay="2000" solid>
          {{ toastMessage }}
      </b-toast>
  </div>
</template>

<script>
import { apiService } from '@/services/apiService';

export default {
  data() {
      return {
          formasPago: [],
          formaPagoSeleccionada: null,
          formaPagoActual: { id: null, nombre: '' },
          formaPagoAEliminar: {},
          isModalVisible: false,
          isEliminarModalVisible: false,
          toastVisible: false,
          toastMessage: '',
          toastVariant: 'danger',
          modoEdicion: false,
          columns: [
              { key: 'nombre', label: 'Nombre' },
              { key: 'acciones', label: 'Acciones' }
          ]
      };
  },
  created() {
      this.cargarFormasPago();
  },
  methods: {
      // Cargar todas las formas de pago
      async cargarFormasPago() {
          try {
              const response = await apiService.get('/formas-pago');
              this.formasPago = response.data;
          } catch (error) {
              this.handleError(error, 'Error al cargar las formas de pago');
          }
      },

      // Mostrar modal de creación
      mostrarModalCrear() {
          this.modoEdicion = false;
          this.formaPagoActual = { id: null, nombre: '' };
          this.isModalVisible = true;
      },

      // Editar forma de pago seleccionada
      editarFormaPago() {
          if (!this.formaPagoSeleccionada) return;
          this.modoEdicion = true;
          this.formaPagoActual = { ...this.formaPagoSeleccionada };
          this.isModalVisible = true;
      },

      // Guardar (crear o actualizar) forma de pago
      async guardarFormaPago() {
          const method = this.modoEdicion ? 'put' : 'post';
          const url = this.modoEdicion ? `/formas-pago/${this.formaPagoActual.id}` : '/formas-pago';

          try {
              await apiService[method](url, this.formaPagoActual);
              this.isModalVisible = false;
              this.cargarFormasPago();
          } catch (error) {
              this.handleError(error, this.modoEdicion ? 'Error al actualizar la forma de pago' : 'Error al crear la forma de pago');
          }
      },

      // Seleccionar forma de pago de la tabla
      seleccionarFormaPago(forma) {
          this.formaPagoSeleccionada = forma;
      },

      // Confirmar eliminación de forma de pago
      confirmarEliminar() {
          this.formaPagoAEliminar = this.formaPagoSeleccionada;
          this.isEliminarModalVisible = true;
      },

      // Eliminar forma de pago
      async eliminarFormaPago() {
          try {
              await apiService.delete(`/formas-pago/${this.formaPagoAEliminar.id}`);
              this.isEliminarModalVisible = false;
              this.cargarFormasPago();
          } catch (error) {
              this.handleError(error, 'Error al eliminar la forma de pago');
          }
      },

      // Manejo de errores y notificaciones
      handleError(error, mensajePredeterminado) {
          let mensajeError = mensajePredeterminado;
          if (error.response) {
              mensajeError = error.response.data?.message || mensajePredeterminado;
          } else {
              mensajeError = error.message || mensajePredeterminado;
          }
          this.toastMessage = mensajeError;
          this.toastVariant = 'danger';
          this.toastVisible = true;
      }
  }
};
</script>

<style scoped>
.table td {
  vertical-align: middle;
}
</style>

