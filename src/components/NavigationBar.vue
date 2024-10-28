<!-- NavBar.vue -->
<template>
    <b-navbar toggleable="lg" type="dark" variant="info">
        <b-container>
            <b-navbar-brand to="/">Mi Aplicación</b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
                <!-- Botón desplegable de Categorías -->
                <b-navbar-nav>
                    <b-nav-item-dropdown text="Categorías" right>
                        <template #button-content>
                            Categorías
                        </template>
                        <b-dropdown-item
                            v-for="categoria in categorias"
                            :key="categoria.id"
                            :to="`/categoria/${categoria.id}`"
                        >
                            {{ categoria.nombre }}
                        </b-dropdown-item>
                    </b-nav-item-dropdown>
                </b-navbar-nav>
                <!-- Opción de Cerrar Sesión -->
                <b-navbar-nav class="ml-auto" v-if="isAuthenticated">
                    <b-nav-item @click="logout">Cerrar sesión</b-nav-item>
                </b-navbar-nav>
            </b-collapse>
        </b-container>
    </b-navbar>
</template>

<script>
import axios from 'axios'

export default {
    name: 'NavigationBar',
    props: {
        isAuthenticated: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            categorias: []
        }
    },
    created() {
        this.fetchCategorias()
    },
    methods: {
        async fetchCategorias() {
            try {
                const response = await axios.get('/api/categorias')
                this.categorias = response.data
            } catch (error) {
                console.error('Error al obtener las categorías:', error)
            }
        },
        logout() {
            localStorage.removeItem('token')
            this.$emit('logout')
        }
    }
}
</script>



