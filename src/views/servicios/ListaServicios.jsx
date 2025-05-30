import React, { useEffect, useState } from 'react';
import { getServicio } from '../../helpers/Servicios/getServicio';
import { eliminarServicio } from '../../helpers/Servicios/deleteServicio';
import styles from './ServiciosCards.module.css';
import { useNavigate } from 'react-router-dom'; 
import { Button } from '@mui/material';
import Swal from 'sweetalert2';

export default function ListaServicios() {
  const [servicios, setServicios] = useState([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const navigate = useNavigate(); 

const handleEliminarServicio = async (id) => {
  const resultado = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará el servicio permanentemente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (!resultado.isConfirmed) return;

  try {
    await eliminarServicio(id);
    setServicios(servicios.filter(serv => serv.IdServicio !== id));
    setServicioSeleccionado(null);

    Swal.fire({
      icon: 'success',
      title: 'Eliminado',
      text: 'El servicio fue eliminado correctamente',
      confirmButtonColor: '#3085d6'
    });
  } catch (error) {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al eliminar el servicio',
      confirmButtonColor: '#d33'
    });
  }
};

  useEffect(() => {
    async function cargarServicios() {
      try {
        const data = await getServicio();
        setServicios(data);
      } catch (error) {
        console.error(error.message);
      }
    }

    cargarServicios();
  }, []);

  const cerrarDetalle = () => setServicioSeleccionado(null);

  return (
    <div>
      <h1 className={styles['title-service']}>SERVICIOS DISPONIBLES</h1>
      <div className={styles.container}>
        {servicios.map((item) => (
          <div
            className={styles["item-card"]}
            key={item.IdServicio}
            onClick={() => setServicioSeleccionado(item)}
            style={{ cursor: 'pointer' }}
          >
 
            <div className={styles["item-card-info"]}>
              <div className={styles["item-card-content"]}>
                <h3 className={styles["item-card-title"]}>{item.Nombre}</h3>
                <p className={styles["item-card-price"]}>
                  Precio: $ {item.Precio?.toFixed(2) ?? 'N/A'}
                </p>
                <p className={styles["item-card-Stock"]}>
                  Duración: {item.DuraciónMinutos ?? 'N/A'} min
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {servicioSeleccionado && (
        <div className={styles["detalle-overlay"]} onClick={cerrarDetalle}>
          <div
            className={styles["detalle-card"]}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{servicioSeleccionado.Nombre}</h2>
            <p><strong>Descripción:</strong> {servicioSeleccionado.Descripción}</p>
            <p><strong>Precio:</strong> ${servicioSeleccionado.Precio?.toFixed(2) ?? 'N/A'}</p>
            <p><strong>Duración:</strong> {servicioSeleccionado.DuraciónMinutos ?? 'N/A'} minutos</p>
            <div className={styles["detalle-actions-buttons"]}>
            <Button
              sx={{ backgroundColor: 'green', color: 'white', '&:hover': { backgroundColor: 'darkgreen' } }}
              onClick={() => navigate(`/servicios/editar/${servicioSeleccionado.IdServicio}`)}
              size="small"
              variant="contained"
            >
              Editar
            </Button>
            <Button
              sx={{ backgroundColor: 'red', color: 'white', '&:hover': { backgroundColor: 'darkred' } }}
              onClick={() => handleEliminarServicio(servicioSeleccionado.IdServicio)}
              size="small"
              variant="contained"
              >
              Eliminar</Button>
              

            <Button onClick={cerrarDetalle} size="small" variant="outlined" color="secondary">
              Cerrar
            </Button>
            </div>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button
        sx={{backgroundColor:'green', color:'white', '&:hover': {backgroundColor:'darkgreen'}}} 
        onClick={()=> navigate('/servicios/crear')}
        > + Añadir Servicio</Button>
      </div>
    </div>
  );
}
