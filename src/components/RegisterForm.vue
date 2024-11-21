<template>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <h2 class="text-center mb-4">Registro de Usuario</h2>
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="nombre" class="form-label">Nombre:</label>
              <input v-model="nombre" type="text" id="nombre" class="form-control" required />
            </div>
            <div class="mb-3">
              <label for="apellido" class="form-label">Apellido:</label>
              <input v-model="apellido" type="text" id="apellido" class="form-control" required />
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Correo Electrónico:</label>
              <input v-model="email" type="email" id="email" class="form-control" required />
            </div>
            <div class="mb-3">
              <label for="username" class="form-label">Nombre de Usuario:</label>
              <input v-model="username" type="text" id="username" class="form-control" required />
            </div>
            <div class="mb-3">
              <label for="contraseña" class="form-label">Contraseña:</label>
              <input v-model="contraseña" type="password" id="contraseña" class="form-control" required />
            </div>
            <div class="mb-3">
              <label for="direccion" class="form-label">Dirección:</label>
              <input v-model="direccion" type="text" id="direccion" class="form-control" />
            </div>
            <div class="mb-3">
              <label for="telefono" class="form-label">Teléfono:</label>
              <input v-model="telefono" type="text" id="telefono" class="form-control" />
            </div>
            <div class="mb-3">
              <label for="rol" class="form-label">Rol:</label>
              <select v-model="rol" id="rol" class="form-select">
                <option value="cliente">Cliente</option>
                <option value="vendedor">Vendedor</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary w-100">Registrar</button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import authService from '@/services/authService';
  
  export default {
    data() {
      return {
        nombre: '',
        apellido: '',
        email: '',
        username: '',
        contraseña: '',
        direccion: '',
        telefono: '',
        rol: 'cliente'
      };
    },
    methods: {
      async handleSubmit() {
        try {
          await authService.register(
            this.nombre,
            this.apellido,
            this.email,
            this.contraseña,
            this.username,
            this.direccion,
            this.telefono,
            this.rol
          );
          alert('Usuario registrado con éxito');
          this.$router.push({ name: 'Login' }); // Redirigir al login después de registro
        } catch (error) {
          alert('Error al registrar: ' + error.message); // Manejo de errores
        }
      }
    }
  };
  </script>
  

  