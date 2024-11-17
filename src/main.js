import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Importa Bootstrap y BootstrapVue 3
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
// Importa BootstrapVue 3
import BootstrapVue3 from 'bootstrap-vue-3';

const app = createApp(App);

// Usa BootstrapVue 3 y el enrutador
app.use(router);
app.use(BootstrapVue3);
app.mount('#app');
