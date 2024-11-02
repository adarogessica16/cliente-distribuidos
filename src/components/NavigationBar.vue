<!-- src/components/NavBar.vue -->
<template>
    <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-navbar-brand to="/">Mi Aplicación</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item to="/" exact>Inicio</b-nav-item>
                <b-nav-item to="/categorias">Categorías</b-nav-item>
                <b-nav-item v-if="!isAuthenticated" to="/login">Iniciar Sesión</b-nav-item>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
                <b-nav-item v-if="isAuthenticated" @click="handleLogout">Cerrar Sesión</b-nav-item>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
export default {
    computed: {
        isAuthenticated() {
            return !!localStorage.getItem('token');
        },
    },
    methods: {
        handleLogout() {
            localStorage.removeItem('token');
            this.$router.push({ name: 'Login' });
        },
    },
};
</script>
