import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styles from './Login.module.css'; 
import logo from '../../assets/logo.jpeg'; 
import { useSpaVehiculosStore } from '../../zustand/SpaVehiculosStore.js';
import { parseJwt } from '../../helpers/Auth/parseJwt.js';
function Login() {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate(); 
  const {currentUser, setCurrentUser} = useSpaVehiculosStore();
  const user = currentUser || localStorage.getItem('CurrentUser');
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const apiUrl = 'http://spavehiculos.runasp.net/api/Login/Ingresar'; 

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({ NombreUsuario: nombreUsuario, Clave: clave }),
      });

      setLoading(false); 

      if (!response.ok) {
        let errorMessage = 'Credenciales inválidas. Intenta de nuevo.';
        try {
          const errorData = await response.json();
         
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.errors && Object.keys(errorData.errors).length > 0) {
           
            errorMessage = Object.values(errorData.errors).flat().join('; ');
          }
        } catch (jsonError) {
          console.error("Error al parsear la respuesta de error:", jsonError);
         
          errorMessage = `Usuario o Contraseña Inválida.`;
        }
        setError(errorMessage);
        return; 
      }

      const data = await response.json();
      const payload = parseJwt(data.Token);

      const userObject = {
        usuario: data.Usuario,
        perfil: data.Perfil,
        paginaInicio: data.PaginaInicio,
        token: data.Token,
        exp: payload?.exp,
      };

      setCurrentUser(userObject);
      localStorage.setItem("CurrentUser", JSON.stringify(userObject));
      console.log('Login exitoso. JWT almacenado:', userObject.token);
      setNombreUsuario('');
      setClave('');
      navigate('/');

    } catch (networkError) {
      setLoading(false);
      setError('No se pudo conectar al servidor. Verifica tu conexión o intenta más tarde.');
      console.error('Error de red durante el login:', networkError);
    }
  };

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className={styles.loginBackground}> 
       <div className={styles.headerContainer}>
        <h1>BIENVENIDO <br /> SISTEMA DE SPA <br /> VEHICULAR</h1>
        <img src={logo} alt="Logo" className={styles.logo} />
        
      </div>
    <div className={styles.loginContainer}>
      <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="nombreUsuario" className={styles.label}>
            Nombre de Usuario:
          </label>
          <input
            type="text"
            id="nombreUsuario"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            required
            className={styles.input}
            disabled={loading} 
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="clave" className={styles.label}>
            Contraseña:
          </label>
          <input
            type="password"
            id="clave"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
            className={styles.input}
            disabled={loading} 
          />
        </div>
        <button
          type="submit"
          className={styles.button}
          disabled={loading} 
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
        {error && <p className={styles.errorMessage}>{error}</p>}
      </form>
      </div>
      </div>
    </div>
  );
}

export default Login;