<template>
    <div class="pedido-form-container">
        <h1>Crear Pedido</h1>
        <div v-if="loading" class="text-center">
            <b-spinner variant="primary" label="Cargando..."></b-spinner>
        </div>

        <b-container v-else>
            <b-form @submit.prevent="crearPedido">
                <b-form-group label="Fecha del Pedido">
                    <b-form-input v-model="pedido.fecha" type="date" required></b-form-input>
                </b-form-group>

                <b-form-group label="Estado">
                    <b-form-select v-model="pedido.estado" :options="estados" required></b-form-select>
                </b-form-group>

                <b-form-group label="Dirección">
                    <b-form-input v-model="pedido.direccion" placeholder="Ingrese la dirección" required></b-form-input>
                </b-form-group>

                <h3>Detalle del Pedido</h3>
                <div class="cart-section">
                    <h2>Carrito de compras</h2>
                    <div v-for="(item, index) in items" :key="index" class="cart-item">
                        <div class="item-info">
                            <h4>{{ item.nombre }}</h4>
                            <p>{{ item.descripcion }}</p>
                            <p class="item-price">${{ item.precio }}</p>
                        </div>
                        <div class="item-quantity">
                            <b-form-group label="Cantidad">
                                <b-form-input
                                    v-model="item.cantidad"
                                    type="number"
                                    min="1"
                                    @change="actualizarCantidad(item)"
                                ></b-form-input>
                            </b-form-group>
                        </div>
                    </div>
                </div>

                <div class="cart-summary">
                    <p>Subtotal: {{ subtotal }}</p>
                    <p>Impuestos: {{ taxes }}</p>
                    <p>Total: Gs.{{ total }}</p>
                </div>

                <b-button type="submit" variant="primary">Crear Pedido</b-button>
                <b-button variant="danger" @click="cancelarPedido">Cancelar</b-button>
            </b-form>

            <b-alert v-if="error" variant="danger" dismissible @dismissed="error = null">
                {{ error }}
            </b-alert>
        </b-container>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'PedidoForm',
    data() {
        return {
            pedido: {
                fecha: '',
                estado: false,
                direccion: '',
                detallePedidos: [], 
                id_Usuario: null 
            },
            estados: [
                { text: 'Pendiente', value: false },
                { text: 'En Proceso', value: true }
            ],
            items: [], 
            loading: false,
            error: null
        };
    },
    computed: {
        subtotal() {
            return this.items.reduce((total, item) => total + item.precio * item.cantidad, 0);
        },
        taxes() {
            return this.subtotal * 0.15; // Ejemplo, 15% de impuestos
        },
        total() {
            return this.subtotal + this.taxes;
        }
    },
    mounted() {
        const carrito = localStorage.getItem('carrito');
        console.log("Productos cargados al carrito:", carrito);
        if (carrito) {
            try {
                this.items = JSON.parse(carrito); // Asignar los productos al array 'items'
            } catch (error) {
                console.error('Error al parsear el carrito:', error);
                this.error = 'Hubo un error al cargar los productos del carrito.';
            }
        } else {
            this.items = []; // Si no hay carrito, asegurarse de que esté vacío
        }
    },
    methods: {
        actualizarCantidad(item) {
            const producto = this.items.find(p => p.id_Producto === item.id_Producto);
            if (producto) {
                producto.cantidad = item.cantidad;
            }
        },

        async crearPedido() {
    try {
        this.loading = true;
        this.error = null;

        // Eliminar duplicados con 'reduce', pero también asegurarnos de que la cantidad de productos se acumule correctamente
        const carritoSinDuplicados = this.items.reduce((acc, item) => {
            const existingItem = acc.find(p => p.id_Producto === item.id_Producto);
            if (existingItem) {
                // Asegurarse de acumular las cantidades correctamente
                existingItem.cantidad += item.cantidad;
            } else {
                acc.push({ ...item }); // Crear una copia del producto y agregarlo al carrito
            }
            return acc;
        }, []);

        // Verificar que los productos tengan un id_Producto válido
        this.pedido.detallePedidos = carritoSinDuplicados
            .filter(item => item.id_Producto != null) // Filtrar productos sin id_Producto
            .map(item => ({
                id_Producto: item.id_Producto,
                cantidad: item.cantidad
            }));

        console.log("Detalle de pedido enviado:", this.pedido.detallePedidos);

        // Verificar si los productos tienen un id_Producto antes de enviarlos
        if (this.pedido.detallePedidos.length === 0) {
            this.error = 'No hay productos en el carrito para crear el pedido.';
            return;
        }

        // Asegúrate de que el token de autenticación esté disponible
        const token = localStorage.getItem('token');
        if (!token) {
            this.error = 'No se encontró un token de autenticación. Inicia sesión nuevamente.';
            return;
        }

        // Enviar el pedido al servidor con el detalle de los productos
        const response = await axios.post('/api/pedidos', this.pedido, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, 
            },
        });

        console.log('Pedido creado exitosamente:', response.data);

        // Limpiar el carrito después de crear el pedido
        this.limpiarCarrito();

        // Redirigir a la página de pedidos
        this.$router.push('/pedidos'); 

    } catch (error) {
        this.error = error.response?.data?.message || 'Error al crear el pedido';
        console.error('Error al crear el pedido:', error);
    } finally {
        this.loading = false;
    }
}
,

        cancelarPedido() {
            // Limpia el carrito y redirige al usuario
            this.limpiarCarrito();
            this.$router.push('/'); // Redirige a la página principal o a la que prefieras
        },

        limpiarCarrito() {
            // Limpiar el carrito del localStorage y los productos en items
            localStorage.removeItem('carrito');
            this.items = [];
        }
    }
};
</script>

<style scoped>
/* Agrega tus estilos aquí */
</style>
