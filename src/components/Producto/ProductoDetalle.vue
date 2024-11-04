<template>
    <div class="producto-detalles-container">
        <h1>Detalles del Producto</h1>
        
        <div v-if="loading" class="text-center">
            <b-spinner variant="primary" label="Cargando..."></b-spinner>
        </div>

        <div v-else>
            <b-card>
                <b-card-title>{{ producto.nombre }}</b-card-title>
                <b-card-text>
                    <strong>Descripción:</strong> {{ producto.descripcion }}
                </b-card-text>
                <b-card-text>
                    <strong>Precio:</strong> ${{ producto.precio.toFixed(2) }}
                </b-card-text>
                <b-card-text>
                    <strong>Categoría:</strong> {{ obtenerNombreCategoria(producto.idCategoria) }}
                </b-card-text>
            </b-card>

            <b-button variant="primary" @click="$router.push('/productos')">Volver a Productos</b-button>
        </div>
        
        <b-alert v-if="error" variant="danger" dismissible @dismissed="error = null">
            {{ error }}
        </b-alert>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'ProductoDetalles',
    data() {
        return {
            producto: null,
            categorias: [],
            loading: true,
            error: null
        };
    },
    async created() {
        await this.fetchCategorias();
        await this.fetchProducto();
    },
    methods: {
        async fetchProducto() {
            try {
                this.loading = true;
                const token = localStorage.getItem('token');
                const { id } = this.$route.params; // Obtiene el ID del producto desde la ruta
                const response = await axios.get(`/api/productos/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                this.producto = response.data;
            } catch (error) {
                this.handleError(error, 'No se pudo cargar el producto');
            } finally {
                this.loading = false;
            }
        },

        async fetchCategorias() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('/api/categorias', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                this.categorias = response.data;
            } catch (error) {
                this.handleError(error, 'Error al cargar las categorías');
            }
        },

        obtenerNombreCategoria(idCategoria) {
            const categoria = this.categorias.find(c => c.id === idCategoria);
            return categoria ? categoria.nombre : 'No asignada';
        },

        handleError(error, mensajePredeterminado) {
            console.error('Error:', error);
            this.error = error.response?.data?.message || mensajePredeterminado;
        }
    }
};
</script>

<style scoped>
.producto-detalles-container {
    padding: 20px;
}
</style>
