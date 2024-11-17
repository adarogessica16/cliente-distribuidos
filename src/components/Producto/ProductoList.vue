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
                    <b-form-input v-model="searchTerm" placeholder="Buscar producto..."
                        @input="debouncedBuscarProducto" />
                </b-col>
            </b-row>

            <b-row>
                <b-col v-for="producto in productosConCategoria" :key="producto.id" md="4" class="mb-4">
                    <b-card>
                    <template #header>
                        <router-link :to="{ name: 'ProductoDetalles', params: { id: producto.id } }">
                            <b-link>{{ producto.nombre }}</b-link>
                        </router-link>
                    </template>
                    <b-card-sub-title>{{ obtenerNombreCategoria(producto.idCategoria) }}</b-card-sub-title>
                    <b-card-text>
                        {{ producto.descripcion }} <br>
                        <strong>Precio:</strong> {{ producto.precio ? producto.precio.toFixed(2) : 'No disponible' }}
                    </b-card-text>
                    <div>
                        <b-button variant="light" @click="añadirCarrito(producto)" class="mr-2"><i class="bi bi-cart4"></i></b-button>
                        <i class="bi bi-pencil-fill me-2" @click="editarProducto(producto)"></i>
                        <i class="bi bi-trash-fill" @click="confirmarEliminar(producto)"></i>
                    </div>
                </b-card>

                </b-col>
            </b-row>

            <b-pagination v-model="currentPage" :total-rows="totalProductos" :per-page="pageSize"
                @change="fetchProductos" />

        </b-container>

        <!-- Modal para Crear/Editar Producto -->
        <b-modal v-model="isModalVisible" :title="modoEdicion ? 'Editar Producto' : 'Nuevo Producto'"
            @ok="guardarProducto" @show="onShowModal" ok-title="Guardar" cancel-title="Cancelar">
            <b-form>
                <b-form-group label="Nombre del Producto">
                    <b-form-input v-model="productoActual.nombre" required
                        placeholder="Ingrese el nombre del producto" />
                </b-form-group>
                <b-form-group label="Descripción">
                    <b-form-textarea v-model="productoActual.descripcion" placeholder="Ingrese una descripción"
                        rows="3" />
                </b-form-group>
                <b-form-group label="Precio">
                    <b-form-input v-model.number="productoActual.precio" type="number" step="0.01" required
                        placeholder="Ingrese el precio" />
                </b-form-group>
                <b-form-group label="Categoría">
                    <b-form-select v-model="productoActual.idCategoria" :options="categoriasOptions" required>
                        <template #first>
                            <b-form-select-option :value="null">Seleccione una categoría</b-form-select-option>
                        </template>
                    </b-form-select>
                </b-form-group>
            </b-form>
        </b-modal>

        <!-- Modal para Confirmar Eliminación -->
        <b-modal v-model="isEliminarModalVisible" title="Confirmar Eliminación" @ok="eliminarProducto"
            ok-title="Eliminar" cancel-title="Cancelar">
            ¿Está seguro que desea eliminar el producto "{{ productoAEliminar.nombre }}"?
        </b-modal>

        <b-toast v-model="toastVisible" :variant="toastVariant" auto-hide-delay="1000" solid>
            {{ toastMessage }}
        </b-toast>
    </div>
</template>

<script>
import { apiService } from '@/services/apiService';
import { debounce } from 'lodash';

export default {
    name: 'ProductoList',
    data() {
        return {
            productos: [],
            categorias: [],
            items: [],
            loading: true,
            error: null,
            currentPage: 1,
            totalProductos: 0,
            pageSize: 1,
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
            isEliminarModalVisible: false,
            toastVisible: false,
            toastMessage: '',
            toastVariant: 'danger'
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
        this.debouncedBuscarProducto = debounce(this.buscarProducto, 500);
    },
    methods: {
        async fetchProductos() {
            try {
                this.loading = true;
                this.error = null;
                const response = await apiService.get(`/productos/page/${this.currentPage}?size=${this.pageSize}`);
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
                this.categorias = Array.isArray(response.data) ? response.data : response.data.categorias || [];
            } catch (error) {
                this.handleError(error, 'Error al cargar las categorías');
            }
        },

        obtenerNombreCategoria(idCategoria) {
            const categoria = this.categorias.find(c => c.id === idCategoria);
            return categoria ? categoria.nombre : 'No asignada';
        },

        async buscarProducto() {
            this.currentPage = 1;
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
            let mensajeError = mensajePredeterminado;

            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        mensajeError = 'No autorizado para realizar esta acción.';
                        break;
                    case 403:
                        mensajeError = 'No tienes permiso para acceder a este recurso.';
                        break;
                    case 404:
                        mensajeError = 'Recurso no encontrado.';
                        break;
                    case 500:
                        mensajeError = 'Error en el servidor. Intente nuevamente más tarde.';
                        break;
                    default:
                        mensajeError = error.response.data?.message || mensajePredeterminado;
                        break;
                }
            } else {
                mensajeError = error.message || mensajePredeterminado;
            }

            this.toastMessage = mensajeError;
            this.toastVariant = 'danger';
            this.toastVisible = true;
        },
        añadirCarrito(producto) {
            console.log('Añadiendo producto al carrito:', producto);
            const productoExistente = this.items.find(item => item.id_Producto === producto.id);

            if (productoExistente) {
                productoExistente.cantidad += 1;
            } else {
                this.items.push({
                    id_Producto: producto.id,
                    nombre: producto.nombre,
                    descripcion: producto.descripcion,
                    precio: producto.precio,
                    cantidad: 1
                });
            }
            localStorage.setItem('carrito', JSON.stringify(this.items));
            console.log('Carrito actualizado:', JSON.parse(localStorage.getItem('carrito')));
        },
    },
    watch: {
        currentPage() {
            this.fetchProductos();
        }
    }


};
</script>