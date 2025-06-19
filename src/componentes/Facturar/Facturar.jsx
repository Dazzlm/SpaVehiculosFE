import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import styles from './Facturar.module.css';
import ListProductos from '../list-productos/ListProductos.jsx';
import ListServicios from '../list-servicios/ListServicios.jsx';
import ListCart from '../list-cart/ListCart.jsx';
import AccionesFactura from '../acciones-factura/AccionesFactura.jsx';

export default function Facturar() {
  const navigate = useNavigate();

  return (
    <div className={styles["container-facturar"]}>
      <div style={{ marginBottom: '1rem', marginLeft: '2rem' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/facturacion')} // Ajusta la ruta según necesites
        >
          Regresar
        </Button>
      </div>
      <div className={styles["container-facturacion"]}>
        

        <div className={styles["container-items-venta"]}>
          <div className={styles["list-productos"]}>
            <ListProductos />
          </div>
          <div className={styles["list-servicios"]}>
            <ListServicios />
          </div>
        </div>

        <div className={styles["container-resumen"]}>
          <h2 className={styles["titulo"]}>Resumen de la Factura</h2>
          <ListCart />
          <div className={styles["acciones-factura"]}>
            <AccionesFactura />
          </div>
        </div>
      </div>
    </div>
    
  );
}