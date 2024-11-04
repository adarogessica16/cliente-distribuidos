<template>
    <div class="productos-container">
        <h1>Productos</h1>
        <div v-if="loading" class="text-center">
            <b-spinner variant="primary" label="Cargando..."></b-spinner>
        </div>

        <b-container v-else>
            <b-row>
                <b-col>
                    <b-button variant="primary" @click="mostrarModalCrear" class="mb-3">
                        Nuevo Producto
                    </b-button>
                </b-col>
                <b-col>
                    <b-form-input
                        v-model="searchTerm"
                        placeholder="Buscar producto..."
                        @input="buscarProducto"
                    />
                </b-col>
            </b-row>

            <b-row>
                <b-col v-for="producto in productosConCategoria" :key="producto.id" md="4" class="mb-4">
                    <b-card :title="producto.nombre" :sub-title="obtenerNombreCategoria(producto.idCategoria)">
                        <b-card-text>
                            {{ producto.descripcion }} <br>
                            <strong>Precio:</strong> ${{ producto.precio.toFixed(2) }}
                        </b-card-text>
                        <b-button variant="info" @click="editarProducto(producto)" class="mr-2">Editar</b-button>
                        <b-button variant="danger" @click="confirmarEliminar(producto)">Eliminar</b-button>
                    </b-card>
                </b-col>
            </b-row>

            <b-pagination 
                v-model="currentPage" 
                :total-rows="totalProductos" 
                :per-page="pageSize" 
                @change="fetchProductos"
            />
        </b-container>

        <!-- Modal para Crear/Editar Producto -->
        <b-modal v-model="isModalVisible" :title="modoEdicion ? 'Editar Producto' : 'Nuevo Producto'" @ok="guardarProducto" @show="onShowModal">
            <b-form>
                <b-form-group label="Nombre del Producto">
                    <b-form-input 
                        v-model="productoActual.nombre" 
                        required
                        placeholder="Ingrese el nombre del producto"
                    />
                </b-form-group>
                <b-form-group label="Descripción">
                    <b-form-textarea 
                        v-model="productoActual.descripcion"
                        placeholder="Ingrese una descripción"
                        rows="3"
                    />
                </b-form-group>
                <b-form-group label="Precio">
                    <b-form-input 
                        v-model.number="productoActual.precio"
                        type="number"
                        step="0.01"
                        required
                        placeholder="Ingrese el precio"
                    />
                </b-form-group>
                <b-form-group label="Categoría">
                    <b-form-select 
                        v-model="productoActual.idCategoria"
                        :options="categoriasOptions"
                        required
                    >
                        <template #first>
                            <b-form-select-option :value="null">Seleccione una categoría</b-form-select-option>
                        </template>
                    </b-form-select>
                </b-form-group>
            </b-form>
        </b-modal>

        <!-- Modal para Confirmar Eliminación -->
        <b-modal v-model="isEliminarModalVisible" title="Confirmar Eliminación" @ok="eliminarProducto">
            ¿Está seguro que desea eliminar el producto "{{ productoAEliminar.nombre }}"?
        </b-modal>

        <b-alert v-if="error" variant="danger" dismissible @dismissed="error = null">
            {{ error }}
        </b-alert>
    </div>
</template>

<script>
import { apiService } from '@/services/apiService';

export default {
    name: 'ProductoList',
    data() {
        return {
            productos: [],
            categorias: [],
            loading: true,
            error: null,
            currentPage: 1,
            totalProductos: 0,
            pageSize: 10,
            searchTerm: '',
            modoEdicion: false,
            productoActual: {
                nombre: '',
                descripcion: '',
                precio: 0,
                idCategoria: null
            },
            productoAEliminar: {},
            isModalVisible: false,
            isEliminarModalVisible: false
        };
    },
    computed: {
        categoriasOptions() {
            return this.categorias.map(categoria => ({
                value: categoria.id,
                text: categoria.nombre
            }));
        },
        productosConCategoria() {
            return this.productos.map(producto => ({
                ...producto,
                categoria: this.obtenerNombreCategoria(producto.idCategoria)
            }));
        }
    },
    async mounted() {
        await this.fetchCategorias();
        await this.fetchProductos();
    },
    methods: {
        async fetchProductos() {
            try {
                this.loading = true;
                this.error = null;
                const response = await apiService.get(`/productos/page/${this.currentPage}`);
                console.log("llamada api", response);
                this.productos = response.data.productos;
                this.totalProductos = response.data.totalElements || response.data.productos.length;
            } catch (error) {
                this.handleError(error, 'No se pudieron cargar los productos');
            } finally {
                this.loading = false;
            }
        },

        async fetchCategorias() {
            try {
                const response = await apiService.get('/categorias');
                this.categorias = Array.isArray(response.data) ? response.data : 
                                 response.data.categorias ? response.data.categorias : [];
            } catch (error) {
                this.handleError(error, 'Error al cargar las categorías');
            }
        },

        obtenerNombreCategoria(idCategoria) {
            const categoria = this.categorias.find(c => c.id === idCategoria);
            return categoria ? categoria.nombre : 'No asignada';
        },

        async buscarProducto() {
            if (this.searchTerm.trim() === '') {
                await this.fetchProductos();
                return;
            }
            try {
                const response = await apiService.get(`/productos/buscar/${this.searchTerm}`);
                this.productos = Array.isArray(response.data) ? response.data : [response.data];
                this.totalProductos = this.productos.length;
            } catch (error) {
                this.handleError(error, 'Error al buscar productos');
            }
        },

        mostrarModalCrear() {
            this.modoEdicion = false;
            this.productoActual = {
                nombre: '',
                descripcion: '',
                precio: 0,
                idCategoria: null
            };
            this.isModalVisible = true;
        },

        editarProducto(producto) {
            this.modoEdicion = true;
            this.productoActual = { 
                ...producto,
                idCategoria: producto.idCategoria
            };
            this.isModalVisible = true;
        },

        onShowModal() {
            if (!this.categorias.length) {
                this.fetchCategorias();
            }
        },

        async guardarProducto(evt) {
            evt.preventDefault();
            if (!this.productoActual.idCategoria) {
                this.error = 'Debe seleccionar una categoría';
                return;
            }

            try {
                const productoData = {
                    ...this.productoActual,
                    precio: Number(this.productoActual.precio)
                };

                if (this.modoEdicion) {
                    await apiService.put(`/productos/actualizar/${this.productoActual.id}`, productoData);
                } else {
                    await apiService.post('/productos', productoData);
                }
                this.isModalVisible = false;
                await this.fetchCategorias();
                await this.fetchProductos();
            } catch (error) {
                this.handleError(error, this.modoEdicion ? 'Error al actualizar el producto' : 'Error al crear el producto');
            }
        },

        confirmarEliminar(producto) {
            this.productoAEliminar = producto;
            this.isEliminarModalVisible = true;
        },

        async eliminarProducto() {
            try {
                await apiService.delete(`/productos/eliminar/${this.productoAEliminar.id}`);
                this.isEliminarModalVisible = false;
                await this.fetchProductos();
            } catch (error) {
                this.handleError(error, 'Error al eliminar el producto');
            }
        },

        handleError(error, mensajePredeterminado) {
            console.error('Error:', error);
            this.error = error.response?.data?.message || mensajePredeterminado;
        }
    }
};
</script>
