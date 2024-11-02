// views/NotFound.vue
<template>
    <div class="not-found-container">
        <div class="text-center">
            <h1 class="display-1 mb-4">404</h1>
            <h2 class="mb-4">Página no encontrada</h2>
            <p class="mb-4">Lo sentimos, la página que buscas no existe o ha sido movida.</p>
            <router-link to="/" class="btn btn-primary">
                Volver al inicio
            </router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NotFound'
}
</script>

<style scoped>
.not-found-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
}

.display-1 {
    font-size: 6rem;
    font-weight: bold;
    color: #dc3545;
}
</style>