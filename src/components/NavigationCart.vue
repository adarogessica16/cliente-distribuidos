<template>
  <div>
    <b-nav class="custom-nav" align="center">
      <b-nav-item class="custom-nav-item">1. Carrito de compras</b-nav-item>
      <b-nav-item class="custom-nav-item">
        <router-link class="custom-nav-item" to="/crear-pedido">2. Detalles de envío</router-link>
      </b-nav-item>
      <b-nav-item class="custom-nav-item">3. Forma de pago</b-nav-item>
    </b-nav>
  </div>
</template>

<style>
.custom-nav {
    background-color: #EBEBEB; /* Color de fondo */
    padding: 10px; /* Espaciado */
    border-radius: 5px; /* Bordes redondeados */
}

.custom-nav-item {
    color: #AAAAAA!important; /* Forzar color del texto */
    font-weight: bold; /* Puedes agregar esto si quieres hacer el texto más destacable */
    text-decoration: none !important;
}

.custom-nav-item:hover {
    color: #929292 !important; /* Color al pasar el mouse */
    text-decoration: none !important;
}
</style>
