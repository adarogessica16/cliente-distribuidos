<template>
    <form @submit.prevent="handleLogin">
        <div class="mb-3">
            <label for="username" class="form-label">Nombre de Usuario</label>
            <input type="text" class="form-control" id="username" v-model="username" required />
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Contraseña</label>
            <input type="password" class="form-control" id="password" v-model="password" required />
        </div>
        <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
    </form>
</template>

<script>
import authService from '@/services/authService';

export default {
    name: "LoginComponent",
    data() {
        return {
            username: "",
            password: "",
        };
    },
    methods: {
        async handleLogin() {
            try {
                // Llamada a authService para el inicio de sesión
                await authService.login(this.username, this.password);

                // Redirigir a la página de inicio
                this.$router.push({ name: "Home" });
            } catch (error) {
                alert(error.message || "Error en el inicio de sesión");
            }
        },
    },
};
</script>
