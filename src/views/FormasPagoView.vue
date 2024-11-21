<template>
  <div class="container my-4">
    <h1>Formas de Pago</h1>

    <!-- Barra de búsqueda y botón de crear (en una fila separada) -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <b-form-input
        v-model="busquedaNombre"
        placeholder="Buscar por nombre..."
        @input="buscarFormasPago"
        class="w-50"
      ></b-form-input>
      <button type="button" class="btn btn-outline-success ml-3" @click="mostrarModalCrear">
        Crear Forma de Pago
      </button>
    </div>

    <!-- Tabla de formas de pago -->
    <b-table striped hover :items="formasPago" :fields="columns" class="table table-bordered">
      <template #cell(acciones)="row">
        <div class="d-flex justify-content-end" style="gap: 20px;">
          <button type="button" class="btn btn-outline-dark" @click="seleccionarFormaPago(row.item)">
            Seleccionar
          </button>
          <button type="button" class="btn btn-outline-warning" @click="editarFormaPago(row.item)">
            Editar
          </button>
          <button type="button" class="btn btn-outline-danger" @click="confirmarEliminar(row.item)">
            Eliminar
          </button>
        </div>
      </template>
    </b-table>

    <p v-if="formasPago.length === 0">No hay formas de pago disponibles.</p>

    <!-- Modal para crear o editar forma de pago -->
    <b-modal v-model="isModalVisible" :title="modoEdicion ? 'Editar Forma de Pago' : 'Nueva Forma de Pago'" @ok="guardarFormaPago" ok-title="Guardar" cancel-title="Cancelar" centered>
      <b-form>
        <b-form-group label="Nombre de la Forma de Pago">
          <b-form-input v-model="formaPagoActual.nombre" required placeholder="Ingrese el nombre de la forma de pago" />
        </b-form-group>
      </b-form>
    </b-modal>

    <!-- Modal para eliminar una forma de pago -->
    <b-modal v-model="isEliminarModalVisible" title="Confirmar Eliminación" @ok="eliminarFormaPago" ok-title="Eliminar" cancel-title="Cancelar" centered>
      ¿Está seguro que desea eliminar la forma de pago "{{ formaPagoAEliminar.nombre }}"?
    </b-modal>

    <b-toast v-model="toastVisible" :variant="toastVariant" auto-hide-delay="2000" solid>
      {{ toastMessage }}
    </b-toast>

    <!-- Mensaje de error -->
    <b-alert v-if="error" variant="danger" dismissible @dismissed="error = null">
      {{ error }}
    </b-alert>

  </div>
</template>

<script>
import { apiService } from '@/services/apiService';

export default {
  data() {
    return {
      formasPago: [], // Lista de formas de pago
      busquedaNombre: '', // Variable para almacenar el valor de búsqueda
      formaPagoSeleccionada: null,
      formaPagoActual: { id: null, nombre: '' },
      formaPagoAEliminar: {},
      isModalVisible: false,
      isEliminarModalVisible: false,
      toastVisible: false,
      toastMessage: '',
      toastVariant: 'danger',
      modoEdicion: false,
      error: null, // Mensaje de error
      columns: [
        { key: 'nombre', label: 'Método' },
        { key: 'acciones', label: 'Acciones', class: 'text-end' }
      ]
    };
  },
  created() {
    this.cargarFormasPago(); // Cargar todas las formas de pago inicialmente
  },
  methods: {
    // Cargar las formas de pago con búsqueda
    async cargarFormasPago(nombre = '') {
      try {
        const response = await apiService.get('/formas-pago', { params: { nombre } });
        this.formasPago = response.data;
        console.log('Formas de pago cargadas:', this.formasPago); // Para verificar los datos
      } catch (error) {
        this.handleError(error, 'Error al cargar las formas de pago');
      }
    },

    // Función para buscar formas de pago por nombre
    buscarFormasPago() {
      console.log('Buscando formas de pago con nombre:', this.busquedaNombre); // Verificar el valor de búsqueda
      this.cargarFormasPago(this.busquedaNombre); // Llamar con el valor de búsqueda
    },

    // Mostrar el modal para crear una nueva forma de pago
    mostrarModalCrear() {
      this.modoEdicion = false;
      this.formaPagoActual = { id: null, nombre: '' };
      this.isModalVisible = true;
    },

    // Función para editar una forma de pago
    editarFormaPago(forma) {
      this.modoEdicion = true;
      this.formaPagoActual = { ...forma };
      this.isModalVisible = true;
    },

    // Guardar una forma de pago (crear o editar)
    async guardarFormaPago() {
      const method = this.modoEdicion ? 'put' : 'post';
      const url = this.modoEdicion ? `/formas-pago/${this.formaPagoActual.id}` : '/formas-pago';

      try {
        await apiService[method](url, this.formaPagoActual);
        this.isModalVisible = false;
        this.cargarFormasPago(); // Recargar formas de pago después de guardar
      } catch (error) {
        this.handleError(error, this.modoEdicion ? 'Error al actualizar la forma de pago' : 'Error al crear la forma de pago');
      }
    },

    // Seleccionar una forma de pago
    seleccionarFormaPago(forma) {
      this.formaPagoSeleccionada = forma;
    },

    // Confirmar la eliminación de una forma de pago
    confirmarEliminar(forma) {
      this.formaPagoAEliminar = forma;
      this.isEliminarModalVisible = true;
    },

    // Eliminar una forma de pago
    async eliminarFormaPago() {
      try {
        await apiService.delete(`/formas-pago/${this.formaPagoAEliminar.id}`);
        this.isEliminarModalVisible = false;
        this.cargarFormasPago(); // Recargar formas de pago después de eliminar
      } catch (error) {
        this.handleError(error, 'Error al eliminar la forma de pago');
      }
    },

    // Manejar errores
    handleError(error, mensajePredeterminado) {
      let mensajeError = mensajePredeterminado;
      if (error.response) {
        mensajeError = error.response.data?.message || mensajePredeterminado;
      } else {
        mensajeError = error.message || mensajePredeterminado;
      }
      this.error = mensajeError;
    }
  }
};
</script>
