<template>
  <div>
    <h1>Formas de Pago</h1>
    <button @click="fetchFormasPago">Cargar Formas de Pago</button>
    <div v-if="loading">Cargando...</div>

    <table v-if="formasPago.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="forma in formasPago" :key="forma.id">
          <td>{{ forma.id }}</td>
          <td>{{ forma.nombre }}</td>
        </tr>
      </tbody>
    </table>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>
  </div>
</template>

<script>
import { apiService } from '@/services/apiService';

export default {
  name: 'FormasPagoView',
  data() {
    return {
      formasPago: [],
      loading: false,
      error: null
    };
  },
  methods: {
    async fetchFormasPago() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.error = 'No se encontró el token de autenticación';
          this.loading = false;
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const response = await apiService('/formas-pago', config);
        this.formasPago = response.data;
      } catch (error) {
        this.error = 'Error al cargar las formas de pago: ' + error.message;
      } finally {
        this.loading = false;
      }
    }
  },
  created() {
    this.fetchFormasPago();
  }
};
</script>
