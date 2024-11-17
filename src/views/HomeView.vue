<!-- src/views/HomeView.vue -->
<template>
    <div>
        <b-container v-if="isAuthenticated">
            <h1>Bienvenido al Inicio</h1>
            <ProductoList/>
        </b-container>
        <b-container v-else>
            <b-alert variant="warning">
                Debes iniciar sesión para ver esta página.
            </b-alert>
            <router-link to="/login">
                <b-button variant="primary">Iniciar sesión</b-button>
            </router-link>
        </b-container>
    </div>
</template>

<script>
import ProductoList from '@/components/Producto/ProductoList.vue';

export default {
    name: 'HomeView',
    components:{
        ProductoList
    },
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
