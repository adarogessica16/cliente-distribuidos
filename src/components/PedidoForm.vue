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

                <b-button type="submit" variant="primary">Crear Pedido</b-button>
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
            loading: false,
            error: null
        };
    },
    created() {
      
        this.obtenerIdUsuario();
    },
    methods: {
        async obtenerIdUsuario() {
            const token = localStorage.getItem('token');
            console.log(token)
            if (token) {
                try {
          
            const payload = JSON.parse(atob(token.split('.')[1]));

           
            if ('id' in payload) {
                this.pedido.id_Usuario = payload.id;
            } else {
                console.warn('El campo Id no existe en el token.');
                this.error = 'El token no contiene información de usuario válida.';
            }
        } catch (error) {
            console.error('Error al obtener el ID del usuario:', error);
            this.error = 'Token inválido o corrupto.';
        }
            }            
        },
        async crearPedido() {
            try {
                this.loading = true;
                this.error = null;
                console.log(this.pedido);
                const token = localStorage.getItem('token');
                if (!token) {
                    this.error = 'No se encontró un token de autenticación. Inicia sesión nuevamente.';
                    return;
                }

               
                const response = await axios.post('/api/pedidos', this.pedido, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, 
                    },
                });

                
                console.log('Pedido creado exitosamente:', response.data);
                this.$router.push('/pedidos'); 
            } catch (error) {
                this.error = error.response?.data?.message || 'Error al crear el pedido';
                console.error('Error al crear el pedido:', error);
            } finally {
                this.loading = false;
            }
        }
    }
};
</script>
