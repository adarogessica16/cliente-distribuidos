<template>
    <div class="categorias-container">
        <h1>Categorías</h1>
        <div v-if="loading" class="text-center">
            <b-spinner variant="primary" label="Cargando..."></b-spinner>
        </div>

        <b-container v-else>
            <b-row>
                <b-col>
                    <b-button variant="primary" @click="mostrarModalCrear" class="mb-3">
                        Nueva Categoría
                    </b-button>
                </b-col>
                <b-col>
                    <b-form-input v-model="searchTerm" placeholder="Buscar categoría..." @input="buscarCategoria" />
                </b-col>
            </b-row>

            <b-table striped hover :items="categorias" :fields="columns">
                <template #cell(acciones)="row">
                    <i class="bi bi-pencil-fill me-2" @click="editarCategoria(row.item)"></i>
                    <i class="bi bi-trash-fill" @click="confirmarEliminar(row.item)"></i>
                </template>
            </b-table>

            <b-pagination v-model="currentPage" :total-rows="totalCategorias" :per-page="pageSize"
                @change="fetchCategorias" />
        </b-container>

        <!-- Modales de Crear/Editar y Confirmación de Eliminación -->
        <b-modal v-model="isModalVisible" :title="modoEdicion ? 'Editar Categoría' : 'Nueva Categoría'"
            @ok="guardarCategoria" ok-title="Guardar" cancel-title="Cancelar">
            <b-form>
                <b-form-group label="Nombre de la Categoría">
                    <b-form-input v-model="categoriaActual.nombre" required
                        placeholder="Ingrese el nombre de la categoría" />
                </b-form-group>
                <b-form-group label="Descripción">
                    <b-form-textarea v-model="categoriaActual.descripcion" placeholder="Ingrese una descripción"
                        rows="3" />
                </b-form-group>
            </b-form>
        </b-modal>

        <b-modal v-model="isEliminarModalVisible" title="Confirmar Eliminación" @ok="eliminarCategoria"
            ok-title="Eliminar" cancel-title="Cancelar">
            ¿Está seguro que desea eliminar la categoría "{{ categoriaAEliminar.nombre }}"?
        </b-modal>

        <b-toast v-model="toastVisible" :variant="toastVariant" auto-hide-delay="1000" solid>
            {{ toastMessage }}
        </b-toast>
    </div>
</template>

<script>
import { apiService } from '@/services/apiService';

export default {
    name: 'CategoriaList',
    data() {
        return {
            categorias: [],
            loading: true,
            error: null,
            currentPage: 1,
            totalCategorias: 0,
            pageSize: 1,
            searchTerm: '',
            columns: [
                { key: 'nombre', label: 'Nombre' },
                { key: 'descripcion', label: 'Descripción' },
                { key: 'acciones', label: 'Acciones' }
            ],
            modoEdicion: false,
            categoriaActual: { nombre: '', descripcion: '' },
            categoriaAEliminar: {},
            isModalVisible: false,
            isEliminarModalVisible: false,
            toastVisible: false,
            toastMessage: '',
            toastVariant: 'danger'

        };
    },
    created() {
        this.fetchCategorias();
    },
    methods: {
        async fetchCategorias() {
            if (this.searchTerm.trim() !== '') {
                await this.buscarCategoria();
                return;
            }

            try {
                this.loading = true;
                this.error = null;
                const response = await apiService.get(`/categorias/page/${this.currentPage}?size=${this.pageSize}`);
                this.categorias = response.data.categorias;
                this.totalCategorias = response.data.totalElements || response.data.categorias.length;
                const totalPages = Math.ceil(this.totalCategorias / this.pageSize);
                if (this.currentPage > totalPages) {
                    this.currentPage = totalPages;
                }
            } catch (error) {
                this.handleError(error, 'No se pudieron cargar las categorías');
            } finally {
                this.loading = false;
            }
        },

        async buscarCategoria() {
            this.currentPage = 1;
            try {
                const response = await apiService.get(`/categorias/buscar/${this.searchTerm}`);
                this.categorias = Array.isArray(response.data) ? response.data : [response.data];
                this.totalCategorias = this.categorias.length;
            } catch (error) {
                this.handleError(error, 'Error al buscar categorías');
            }
        },

        mostrarModalCrear() {
            this.modoEdicion = false;
            this.categoriaActual = { nombre: '', descripcion: '' };
            this.isModalVisible = true;
        },

        editarCategoria(categoria) {
            this.modoEdicion = true;
            this.categoriaActual = { ...categoria };
            this.isModalVisible = true;
        },

        async guardarCategoria() {
            const method = this.modoEdicion ? 'put' : 'post';
            const url = this.modoEdicion ? `/categorias/actualizar/${this.categoriaActual.id}` : '/categorias/guardar';

            try {
                await apiService[method](url, this.categoriaActual);
                this.isModalVisible = false;
                await this.fetchCategorias();
            } catch (error) {
                this.handleError(error, this.modoEdicion ? 'Error al actualizar la categoría' : 'Error al crear la categoría');
            }
        },

        confirmarEliminar(categoria) {
            this.categoriaAEliminar = categoria;
            this.isEliminarModalVisible = true;
        },

        async eliminarCategoria() {
            try {
                await apiService.delete(`/categorias/eliminar/${this.categoriaAEliminar.id}`);
                this.isEliminarModalVisible = false;
                await this.fetchCategorias();
            } catch (error) {
                this.handleError(error, 'Error al eliminar la categoría');
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
        }
    },
    watch: {
        currentPage() {
            this.fetchCategorias();
        }
    }
};
</script>

