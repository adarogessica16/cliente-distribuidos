<template>
    <div class="pedidos-container">
        <h1>Mis Pedidos</h1>
        
        <div v-if="loading" class="text-center">
            <b-spinner variant="primary" label="Cargando..."></b-spinner>
        </div>

        <b-container v-else>
            <b-row>
                <b-col>
                    <b-button variant="primary" @click="mostrarModalCrear" class="mb-3">
                        Nuevo Pedido
                    </b-button>
                </b-col>
                <b-col>
                    <b-form-input v-model="searchTerm" placeholder="Buscar pedido..." @input="buscarPedido" />
                </b-col>
            </b-row>

            <b-table striped hover :items="pedidos" :fields="columns">
                <template #cell(acciones)="row">
                    <b-button variant="info" size="sm" @click="verDetallesPedido(row.item)" class="mr-2">
                        Ver Detalles
                    </b-button>
                </template>
            </b-table>

            <b-pagination v-model="currentPage" :total-rows="totalPedidos" :per-page="pageSize" @change="fetchPedidos" />

         
            <b-alert v-if="!pedidos.length && !loading" variant="info">
                No tienes pedidos asignados.
            </b-alert>
        </b-container>

        
        <b-modal v-model="isDetallesModalVisible" title="Detalles del Pedido">
            <p><strong>ID del Pedido:</strong> {{ pedidoActual.id }}</p>
            <p><strong>Fecha:</strong> {{ pedidoActual.fecha }}</p>
            <p><strong>Estado:</strong> {{ pedidoActual.estado ? 'En Proceso' : 'Pendiente' }}</p>
            <p><strong>Dirección:</strong> {{ pedidoActual.direccion }}</p>
            <p><strong>Detalles:</strong></p>

            <ul v-if="pedidoActual.detallePedidos && Array.isArray(pedidoActual.detallePedidos) && pedidoActual.detallePedidos.length > 0">
                <li v-for="detalle in pedidoActual.detallePedidos" :key="detalle.id">
                    Producto: {{ detalle.id_Producto }} - Cantidad: {{ detalle.cantidad }}
                </li>
            </ul>
            <p v-else>No hay detalles disponibles para este pedido.</p>
        </b-modal>

        <b-alert v-if="error" variant="danger" dismissible @dismissed="error = null">
            {{ error }}
        </b-alert>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'PedidosView',
    data() {
        return {
            pedidos: [],
            loading: true,
            error: null,
            currentPage: 0,
            totalPedidos: 0,
            pageSize: 20,
            searchTerm: '',
            columns: [
                { key: 'fecha', label: 'Fecha' },
                { key: 'estado', label: 'Estado' },
                { key: 'direccion', label: 'Dirección' },
                { key: 'acciones', label: 'Acciones' }
            ],
            pedidoActual: {
                detallePedidos: [] 
            },
            isDetallesModalVisible: false
        };
    },
    async created() {
        await this.fetchPedidos();
    },
    methods: {
        async fetchPedidos() {
            try {
                this.loading = true;
                this.error = null;
                const token = localStorage.getItem('token');
                console.log('jwt token:',token);
                console.log(`Llamando a la URL: /api/pedidos`);
                const response = await axios.get(`/api/pedidos`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('Datos recibidos:', response.data);
                this.pedidos = response.data.content; 
                this.totalPedidos = response.data.totalElements || response.data.content.length;
            } catch (error) {
                console.log(error);
                this.handleError(error, 'No se pudieron cargar los pedidos');
            } finally {
                this.loading = false;
            }
        },
        verDetallesPedido(pedido) {
            this.pedidoActual = { ...pedido };
            this.isDetallesModalVisible = true;
        },
        handleError(error, mensajePredeterminado) {
            console.error('Error:', error);
            this.error = error.response?.data?.message || mensajePredeterminado;
        }
    }
};
</script>

<style scoped>
.pedidos-container {
    padding: 20px;
}
</style>
