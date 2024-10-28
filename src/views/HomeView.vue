<!-- HomeView.vue -->
<template>
    <div>
        <b-container v-if="isAuthenticated">
            <h1>Bienvenido al Inicio</h1>
            <p>Contenido protegido que solo se muestra si el usuario está autenticado.</p>
            <NavigationBar :categorias="categorias" :isAuthenticated="isAuthenticated" @logout="handleLogout" />
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
import NavigationBar from '@/components/NavigationBar.vue'
import axios from 'axios'

export default {
    name: 'HomeView',
    components: {
        NavigationBar
    },
    data() {
        return {
            categorias: [],
            isAuthenticated: false
        }
    },
    created() {
        this.isAuthenticated = !!localStorage.getItem('token')
        this.fetchCategorias()
    },
    methods: {
        async fetchCategorias() {
            try {
                const response = await axios.get('/api/categorias') // Asegúrate que este endpoint exista y funcione.
                this.categorias = response.data
            } catch (error) {
                console.error('Error fetching categories:', error)
            }
        },
        handleLogout() {
            localStorage.removeItem('token')
            this.isAuthenticated = false
            this.$router.push({ name: 'Login' })
        }
    }
}
</script>
