<template>
    <div>
        <h1>Inventarios</h1>

        <!-- Botón para abrir el modal de creación de inventario -->
        <b-button @click="showCreateModal = true" variant="primary" class="mb-3">
            Crear Inventario
        </b-button>

        <!-- Modal para crear un nuevo inventario -->
        <b-modal v-model="showCreateModal" title="Crear Inventario" hide-footer>
            <b-form @submit.prevent="submitForm">
                <b-form-group label="Nombre del Inventario" label-for="nombre">
                    <b-form-input id="nombre" v-model="formData.nombre" required></b-form-input>
                </b-form-group>
                <b-form-group label="Fecha" label-for="fecha">
                    <b-form-input id="fecha" v-model="formData.fecha" type="date" required></b-form-input>
                </b-form-group>

                <b-form-group label="Detalles del Inventario">
                    <b-table :items="detalleItems" :fields="detalleFields" responsive>
                        <template v-slot:cell(cantidad)="data">
                            <b-form-input v-model="data.item.cantidad" type="number" min="1"
                                @change="updateDetalle(data.item)"></b-form-input>
                        </template>
                        <template v-slot:cell(producto)="data">
                            {{ data.item.producto }}
                        </template>
                        <template v-slot:cell(actions)="data">
                            <i class="bi bi-trash-fill " @click="removeDetalle(data.item)"></i>
                        </template>
                    </b-table>

                    <b-row>
                        <b-col>
                            <b-form-group label="Producto">
                                <b-form-select v-model="newDetalle.idProducto" :options="productos"
                                    required></b-form-select>
                            </b-form-group>
                        </b-col>
                        <b-col>
                            <b-form-group label="Cantidad">
                                <b-form-input v-model="newDetalle.cantidad" type="number" min="1"
                                    required></b-form-input>
                            </b-form-group>
                        </b-col>
                        <b-col class="d-flex align-items-end">
                            <b-button @click="addDetalle" variant="primary"
                                :disabled="!newDetalle.idProducto || !newDetalle.cantidad">
                                Agregar
                            </b-button>
                        </b-col>
                    </b-row>
                </b-form-group>

                <b-button type="submit" variant="success" :disabled="!isFormValid">Guardar Inventario</b-button>
            </b-form>
        </b-modal>

        <!-- Lista de Inventarios con nombre y detalles -->
        <b-container>
            <b-row>
                <b-col>
                    <b-table :items="inventarios" :fields="fields" responsive>
                        <template v-slot:cell(detalles)="data">
                        <b-button @click="goToDetalles(data.item)" variant="link">
                            <i class="bi bi-eye"></i>
                        </b-button>
                    </template>
                    </b-table>

                    <!-- Botones de paginación -->
                    <b-pagination v-model="pageNum" :total-rows="totalItems" :per-page="numPag"
                        @change="fetchInventarios" aria-controls="inventarios-table"></b-pagination>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import { apiService } from '@/services/apiService';
import { format } from 'date-fns';

export default {
    data() {
        return {
            formData: { nombre: '', fecha: '' },
            newDetalle: { idProducto: null, cantidad: 1 },
            detalleItems: [],
            productos: [],
            inventarios: [],
            pageNum: 1,
            numPag: 1,
            totalItems: 0,
            fields: [
                { key: 'nombre', label: 'Nombre' },
                { key: 'fecha', label: 'Fecha', formatter: this.formatDate },
                { key: 'detalles', label: 'Detalles' },
                { key: 'actions', label: 'Acciones' },
            ],
            detalleFields: [
                { key: 'producto', label: 'Producto' },
                { key: 'cantidad', label: 'Cantidad' },
                { key: 'actions', label: 'Acciones' }
            ],
            showCreateModal: false,
        };
    },
    computed: {
        isFormValid() {
            return (
                this.formData.nombre &&
                this.formData.fecha &&
                this.detalleItems.length > 0 &&
                this.detalleItems.every((item) => item.cantidad > 0)
            );
        },
    },
    methods: {
        formatDate(timestamp) {
            return format(new Date(timestamp), 'dd/MM/yyyy');
        },
        async fetchProductos() {
            try {
                const response = await apiService.get('/productos');
                this.productos = response.data.map((producto) => ({
                    value: producto.id,
                    text: producto.nombre,
                }));
            } catch (error) {
                console.error('Error al obtener productos:', error);
            }
        },
        async fetchInventarios() {
            try {
                const response = await apiService.get(`/inventarios/page/${this.pageNum}`);
                this.inventarios = response.data.inventarios.map((inventario) => ({
                    ...inventario,
                    nombre: inventario.nombre
                }));
                this.totalItems = response.data.total;
                this.numPag = response.data.inventarios.length;
            } catch (error) {
                console.error('Error al obtener inventarios:', error);
            }
        },
        addDetalle() {
            if (this.newDetalle.idProducto && this.newDetalle.cantidad > 0) {
                const product = this.productos.find((p) => p.value === this.newDetalle.idProducto);
                if (product) {
                    const detalle = { 
                        ...this.newDetalle, 
                        producto: product.text
                    };
                    this.detalleItems.push(detalle);
                    this.newDetalle = { idProducto: null, cantidad: 1 };
                }
            }
        },
        updateDetalle(item) {
            const index = this.detalleItems.findIndex((detalle) => detalle.idProducto === item.idProducto);
            if (index !== -1) {
                this.detalleItems[index].cantidad = item.cantidad;
            }
        },
        removeDetalle(item) {
            this.detalleItems = this.detalleItems.filter((detalle) => detalle.idProducto !== item.idProducto);
        },
        async submitForm() {
            const requestData = {
                nombre: this.formData.nombre,
                fecha: this.formData.fecha,
                detalles: this.detalleItems.map(({ idProducto, cantidad }) => ({ idProducto, cantidad })),
            };
            try {
                await apiService.post('/inventarios', requestData);
                this.fetchInventarios();
                this.formData = { nombre: '', fecha: '' };
                this.detalleItems = [];
                this.showCreateModal = false;
            } catch (error) {
                console.error('Error al guardar el inventario:', error);
            }
        },
        goToDetalles(inventario) {
            this.$router.push({ name: 'InventarioDetalles', params: { id: inventario.id } });
        },
    },
    created() {
        this.fetchProductos();
        this.fetchInventarios();
    },
};
</script>


