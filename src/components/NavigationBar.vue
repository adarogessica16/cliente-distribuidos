<!-- src/components/NavBar.vue -->
<template>
    <b-navbar toggleable="lg" type="light" variant="Light" class="navbar-custom-width , navbar-custom-height ">
        <b-navbar-brand to="/">Ñande-commerce</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item to="/" exact>Inicio</b-nav-item>
                <b-nav-item to="/categorias">Categorías</b-nav-item>
                <b-nav-item to="/inventarios">Inventarios</b-nav-item>
                <b-nav-item to="/pedidos">Carrito</b-nav-item>
                <b-nav-item to="/obtener-pedidos">Pedidos</b-nav-item>
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
<style>
.navbar-custom-width {
    width: 90%; /* O cualquier otro ancho que prefieras */
    margin: 0 auto; /* Centrar el navbar si no ocupa el 100% */
}
.navbar-custom-height {
    height: 100px; /* Ajusta el valor según tus necesidades */
    line-height: 100px; /* Alinea el contenido verticalmente */
}
</style>
