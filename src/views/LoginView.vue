<!-- src/views/LoginView.vue -->
<template>
    <div class="container">
        <h2>Iniciar Sesión</h2>
        <Login />
    </div>
</template>

<script>
// Importar el componente Login
import Login from '@/components/loginComponent.vue';

export default {
    name: "LoginView",
    components: {
        Login, // Registrar el componente Login
    },
};
</script>

<style scoped>
.container {
    max-width: 400px;
    margin: 0 auto;
}
</style>

