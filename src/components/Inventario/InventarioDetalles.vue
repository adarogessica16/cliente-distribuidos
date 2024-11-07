<template>
    <div>
        <h1>Detalles del Inventario</h1>
        <b-table
            :items="inventarioDetalles"
            :fields="detalleFields"
            responsive
            show-empty
            empty-text="No hay detalles disponibles"
        >
            <template v-slot:cell(producto)="data">
                {{ getProductoNombre(data.item.idProducto) }}
            </template>
            <template v-slot:cell(cantidad)="data">
                <label>{{ data.item.cantidad }}</label>
            </template>
            <template v-slot:cell(actions)="data">
                    <i class="bi bi-pencil-square" @click="openEditModal(data.item)"></i>
                    <i class="bi bi-trash-fill" @click="openDeleteModal(data.item)"></i>
            </template>
        </b-table>

        <b-button variant="primary" @click="openAddModal" class="mt-3"> Agregar Detalle</b-button>

        <!-- Modal para Agregar/Editar Detalle -->
        <b-modal 
        v-model="showEditModal" 
        title="Agregar/Editar Detalle" 
        @Guardar="saveDetalle"
        ok-title="Guardar"
        cancel-title="Cancelar">
            <div>
                <b-form-group label="Producto">
                    <b-form-select v-model="detalleForm.idProducto" :options="productoOptions"></b-form-select>
                </b-form-group>
                <b-form-group label="Cantidad">
                    <b-form-input v-model.number="detalleForm.cantidad" type="number" min="1"></b-form-input>
                </b-form-group>
            </div>
        </b-modal>

        <!-- Modal de Confirmación para Eliminar -->
        <b-modal 
        v-model="showDeleteModal" 
        title="Confirmar Eliminación" 
        @eliminar="confirmDelete"
        ok-title="Eliminar"
        cancel-title="Cancelar">
            <p>¿Estás seguro de que deseas eliminar este detalle?</p>
        </b-modal>

    </div>
</template>

<script>
import { apiService } from '@/services/apiService';

export default {
    data() {
        return {
            inventarioDetalles: [],
            productos: [],
            productoOptions: [],
            detalleFields: [
                { key: 'producto', label: 'Producto' },
                { key: 'cantidad', label: 'Cantidad' },
                { key: 'actions', label: 'Acciones' }
            ],
            showEditModal: false,
            showDeleteModal: false,
            detalleForm: {
                id: null,
                idProducto: null,
                cantidad: 1
            },
            deleteItemId: null,
        };
    },
    methods: {
        async fetchProductos() {
            try {
                const response = await apiService.get('/productos');
                this.productos = response.data;
                this.productoOptions = this.productos.map(producto => ({
                    value: producto.id,
                    text: producto.nombre
                }));
            } catch (error) {
                console.error('Error al obtener productos:', error);
            }
        },

        getProductoNombre(idProducto) {
            const producto = this.productos.find(p => p.id === idProducto);
            return producto ? producto.nombre : `Producto ${idProducto}`;
        },

        async fetchDetalles() {
            try {
                const response = await apiService.get(`/inventario-detalles/${this.$route.params.id}/detalles`);
                this.inventarioDetalles = Array.isArray(response.data) ? response.data : response.data.detalles;
            } catch (error) {
                console.error('Error al obtener detalles del inventario:', error);
            }
        },

        openAddModal() {
            this.detalleForm = { id: null, idProducto: null, cantidad: 1 };
            this.showEditModal = true;
        },

        openEditModal(item) {
            this.detalleForm = { ...item };
            this.showEditModal = true;
        },

        async saveDetalle() {
            try {
                if (this.detalleForm.id) {
                    await apiService.put(`/inventario-detalles/actualizar/${this.detalleForm.id}`, this.detalleForm);
                } else {
                    this.detalleForm.idInventario = this.$route.params.id;
                    await apiService.post(`/inventario-detalles`, this.detalleForm);
                }
                await this.fetchDetalles();
            } catch (error) {
                console.error('Error al guardar el detalle:', error);
            }
        },

        openDeleteModal(item) {
            this.deleteItemId = item.id;
            this.showDeleteModal = true;
        },

        async confirmDelete() {
            try {
                await apiService.delete(`/inventario-detalles/eliminar/${this.deleteItemId}`);
                await this.fetchDetalles();
            } catch (error) {
                console.error('Error al eliminar el detalle:', error);
            }
        }
    },
    async created() {
        await this.fetchProductos();
        await this.fetchDetalles();
    }
};
</script>



