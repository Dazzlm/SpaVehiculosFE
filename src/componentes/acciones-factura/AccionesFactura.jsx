import { useSpaVehiculosStore } from "../../zustand/SpaVehiculosStore.js";
import { postFactura } from "../../helpers/postFactura.js";
import {getCliente} from "../../helpers/getCliente.js";
import { useState } from "react"; // Asegúrate de importar useState
import { Backdrop, CircularProgress } from "@mui/material";
import styles from "./AccionesFactura.module.css";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function AccionesFactura() {
  const { limpiarCarrito, carrito, currentSede, obtenerTotal } = useSpaVehiculosStore();
 const [isLoading, setIsLoading] = useState(false);
  const generarFactura = async () => {
    console.log(currentSede);
    if (carrito.productos.length === 0 && carrito.servicios.length === 0) {
      Swal.fire("Carrito vacío", "Agrega productos o servicios antes de generar la factura.", "warning");
      return;
    }
    
    const cliente = await getCliente();

    if (!cliente) return;

      const facturaPayload = {
        Factura: {
          IdFactura: 0,
          Fecha: new Date().toISOString(),
          IdCliente: cliente.IdCliente,
          Total: obtenerTotal(),
          IdSede: currentSede ,
        },
        Productos: carrito.productos.map((p) => ({
          IdDetalle: 0,
          IdFactura: 0,
          IdProducto: p.IdProducto,
          Cantidad: p.cantidad || 1,
          Subtotal: parseFloat((p.Precio * (p.cantidad || 1)).toFixed(2)),
        })),
        Servicios: carrito.servicios.map((s) => ({
          IdDetalle: 0,
          IdFactura: 0,
          IdServicio: s.IdServicio,
          Subtotal: parseFloat(s.Precio.toFixed(2)),
        })),
      };
      setIsLoading(true); // Inicia carga
      // Enviar al backend
      const exito = await postFactura(facturaPayload);
      
      if (exito) {
        Swal.fire("Éxito", "Factura generada correctamente.", "success");
        limpiarCarrito();
        
      } else {
        Swal.fire("Error", "No se pudo generar la factura.", "error");
      }
      setIsLoading(false);

  };

 return (
  <>
    <div className={styles["acciones-factura"]}>
      <button className={styles["btn-accion"]} onClick={generarFactura} disabled={isLoading}>
        Generar Factura
      </button>
      <button className={styles["btn-accion"]} onClick={() => limpiarCarrito()} disabled={isLoading}>
        Cancelar Factura
      </button>
    </div>

    {/* Backdrop de carga */}
    <Backdrop
      open={isLoading}
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  </>
);

}