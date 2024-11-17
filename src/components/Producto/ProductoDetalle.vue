<template>
    <div class="producto-detalles-container">
        <h1>Detalles del Producto</h1>
        
        <div v-if="loading" class="text-center">
            <b-spinner variant="primary" label="Cargando..."></b-spinner>
        </div>

        <div v-else-if="producto">
            <b-card>
                <b-card-title>{{ producto.nombre }}</b-card-title>
                <b-card-text>
                    <strong>Descripción:</strong> {{ producto.descripcion }}
                </b-card-text>
                <b-card-text>
                    <strong>Precio:</strong> {{ producto.precio.toFixed(2) }}
                </b-card-text>
                <b-card-text>
                    <strong>Categoría:</strong> {{ obtenerNombreCategoria(producto.idCategoria) }}
                </b-card-text>
            </b-card>

            <b-button variant="primary" @click="$router.push('/productos')">Volver a Productos</b-button>
            <b-button variant="primary" @click="valorarProducto(producto.id)">Valorar</b-button>
            <b-container>
                <ReseñasView/>
            </b-container>
        </div>

        <div v-else>
            <p>El producto no está disponible.</p>
        </div>

        <b-alert v-if="error" variant="danger" dismissible @dismissed="error = null">
            {{ error }}
        </b-alert>
    </div>
</template>


<script>
import axios from 'axios';
import ReseñasView from '../Reseñas/Reseñas.vue';   

export default {
    name: 'ProductoDetalles',
    components:{
        ReseñasView
    },
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
                this.error = null;
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
        },
        valorarProducto(idProducto) {
            this.$router.push({ name: 'CrearReseña', params: { idProducto: idProducto } });
        }
    }
};
</script>

<style scoped>
.producto-detalles-container {
    padding: 20px;
}
</style>
