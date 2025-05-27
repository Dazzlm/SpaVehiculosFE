
import styles from './Facturacion.module.css';
import ListProductos from '../../componentes/list-productos/ListProductos.jsx';
import ListServicios from '../../componentes/list-servicios/ListServicios.jsx';
import ListCart from '../../componentes/list-cart/ListCart.jsx';
import AccionesFactura from '../../componentes/acciones-factura/AccionesFactura.jsx';
export default function Facturacion() {
  return (
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
       <AccionesFactura />
      </div>
      
    </div>
   
  );
}