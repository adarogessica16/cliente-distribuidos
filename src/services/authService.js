import axios from 'axios'; 

const authService = {

  async login(username, contraseña) {
    try {
      const response = await axios.post('/auth/login', {
        username,
        contraseña
      });

      if (!response.data.jwt) { 
        throw new Error('No se recibió un token válido');
      }

      // Guarda el token en localStorage
      localStorage.setItem('token', response.data.jwt);
      console.log("Token guardado:", response.data.jwt); 
      return true;
    } catch (error) {
      // Manejo detallado de errores de inicio de sesión
      if (error.response) {
        console.error('Error de inicio de sesión:', error.response.data);
        throw new Error(error.response.data.message || 'Error al iniciar sesión');
      } else if (error.request) {
        console.error('No se recibió respuesta del servidor');
        throw new Error('No se puede conectar con el servidor');
      } else {
        console.error('Error al configurar la solicitud', error.message);
        throw new Error('Error interno al iniciar sesión');
      }
    }
  },
  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
};

export default authService;