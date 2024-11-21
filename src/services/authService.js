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

  async register(nombres, apellidos, email, contraseña, username, direccion, telefono, rol) {
    try {
      const response = await axios.post('/auth/register', {
        nombre: nombres,
        apellido: apellidos,
        email: email,
        contraseña: contraseña,
        username: username,
        direccion: direccion,
        telefono: telefono,
        rol: rol
      });

      // Respuesta positiva, puede ser un mensaje de éxito o un estado de 200 OK
      console.log('Usuario registrado con éxito', response.data);
      return true;
    } catch (error) {
      // Manejo de errores de registro
      if (error.response) {
        console.error('Error al registrar usuario:', error.response.data);
        throw new Error(error.response.data || 'Error al registrar usuario');
      } else if (error.request) {
        console.error('No se recibió respuesta del servidor');
        throw new Error('No se puede conectar con el servidor');
      } else {
        console.error('Error al configurar la solicitud', error.message);
        throw new Error('Error interno al registrar usuario');
      }
    }
  },

  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
};

export default authService;
