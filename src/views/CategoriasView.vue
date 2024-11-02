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
                    <b-button variant="info" size="sm" @click="editarCategoria(row.item)" class="mr-2">
                        Editar
                    </b-button>
                    <b-button variant="danger" size="sm" @click="confirmarEliminar(row.item)">
                        Eliminar
                    </b-button>
                </template>
            </b-table>

            <b-pagination v-model="currentPage" :total-rows="totalCategorias" :per-page="pageSize" @change="fetchCategorias" />
        </b-container>

        <!-- Modal para Crear/Editar Categoría -->
        <b-modal v-model="isModalVisible" :title="modoEdicion ? 'Editar Categoría' : 'Nueva Categoría'" @ok="guardarCategoria">
            <b-form>
                <b-form-group label="Nombre de la Categoría">
                    <b-form-input 
                        v-model="categoriaActual.nombre" 
                        required
                        placeholder="Ingrese el nombre de la categoría"
                    />
                </b-form-group>
                <b-form-group label="Descripción">
                    <b-form-textarea 
                        v-model="categoriaActual.descripcion"
                        placeholder="Ingrese una descripción"
                        rows="3"
                    />
                </b-form-group>
            </b-form>
        </b-modal>

        <!-- Modal para Confirmar Eliminación -->
        <b-modal v-model="isEliminarModalVisible" title="Confirmar Eliminación" @ok="eliminarCategoria">
            ¿Está seguro que desea eliminar la categoría "{{ categoriaAEliminar.nombre }}"?
        </b-modal>

        <b-alert v-if="error" variant="danger" dismissible @dismissed="error = null">
            {{ error }}
        </b-alert>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'CategoriasView',
    data() {
        return {
            categorias: [],
            loading: true,
            error: null,
            currentPage: 1,
            totalCategorias: 0,
            pageSize: 10,
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
            isEliminarModalVisible: false
        };
    },
    async created() {
        await this.fetchCategorias();
    },
    methods: {
        async fetchCategorias() {
            try {
                this.loading = true;
                this.error = null;
                const token = localStorage.getItem('token');
                const response = await axios.get(`/api/categorias/page/${this.currentPage}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                this.categorias = response.data.categorias;
                this.totalCategorias = response.data.totalElements || response.data.categorias.length;
            } catch (error) {
                this.handleError(error, 'No se pudieron cargar las categorías');
            } finally {
                this.loading = false;
            }
        },
        async buscarCategoria() {
            if (this.searchTerm.trim() === '') {
                await this.fetchCategorias();
                return;
            }
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`/api/categorias/buscar/${this.searchTerm}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
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
            const token = localStorage.getItem('token');
            try {
                if (this.modoEdicion) {
                    console.log("Token para editar", token);
                    await axios.put(`/api/categorias/actualizar/${this.categoriaActual.id}`, this.categoriaActual, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    });
                } else {
                    console.log("Token para guardar", token);
                    await axios.post('/api/categorias/guardar', this.categoriaActual, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    });
                }
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
            const token = localStorage.getItem('token');
            try {
                await axios.delete(`/api/categorias/eliminar/${this.categoriaAEliminar.id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                this.isEliminarModalVisible = false;
                await this.fetchCategorias();
            } catch (error) {
                this.handleError(error, 'Error al eliminar la categoría');
            }
        },
        handleError(error, mensajePredeterminado) {
            console.error('Error:', error);
            this.error = error.response?.data?.message || mensajePredeterminado;
        }
    }
};
</script>

