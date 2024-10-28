
<template>
    <form @submit.prevent="handleLogin">
        <div class="mb-3">
            <label for="username" class="form-label">Nombre de Usuario</label>
            <input type="text" class="form-control" id="username" v-model="username" required />
        </div>
        <div class="mb-3">
            <label for="password" class="form-label">Contraseña</label>
            <input type="password" class="form-control" id="password" v-model="password" required />
        </div>
        <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
    </form>
</template>

<script>
// Importar Axios
import axios from 'axios';

export default {
    name: "LoginComponent",
    data() {
        return {
            username: "",
            password: "",
        };
    },
    methods: {
        async handleLogin() {
            try {
                const response = await axios.post('/auth/login', {
                    username: this.username,
                    contraseña: this.password,
                });

                localStorage.setItem("token", response.data.token);
                this.$router.push({ name: "Home" });
            } catch (error) {
                alert(error.response?.data?.message || "Error en el inicio de sesión");
            }
        },
    },
};
</script>
