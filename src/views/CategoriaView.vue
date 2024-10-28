<template>
    <div>
        <b-container v-if="isAuthenticated">
            <h1>Categoría: {{ categoria.nombre }}</h1>
            <p>{{ categoria.descripcion }}</p>
            <!-- Agrega aquí el contenido específico de la categoría -->
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
import axios from 'axios'

export default {
    name: 'CategoriaView',
    data() {
        return {
            categoria: null
        }
    },
    created() {
        this.fetchCategoria()
    },
    computed: {
        isAuthenticated() {
            return !!localStorage.getItem('token')
        }
    },
    methods: {
        async fetchCategoria() {
            try {
                const response = await axios.get(`/api/categoria/${this.$route.params.id}`)
                this.categoria = response.data
            } catch (error) {
                console.error('Error fetching categoria:', error)
            }
        }
    }
}
</script>