import { useSpaVehiculosStore } from "../../zustand/SpaVehiculosStore.js";
import { postFactura } from "../../helpers/postFactura.js";
import { getCliente } from "../../helpers/getCliente.js";
import { useState } from "react"; // Asegúrate de importar useState
import { Backdrop, CircularProgress } from "@mui/material";
import styles from "./AccionesFactura.module.css";
import Swal from "sweetalert2";
import { getFacturaPayload } from "../../helpers/getFacturaPayload.js";
import { useNavigate } from "react-router";
export default function AccionesFactura() {
  const { limpiarCarrito, carrito, currentSede, obtenerTotal } =
    useSpaVehiculosStore();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const generarFactura = async () => {
    if (carrito.productos.length === 0 && carrito.servicios.length === 0) {
      Swal.fire(
        "Carrito vacío",
        "Agrega productos o servicios antes de generar la factura.",
        "warning"
      );
      return;
    }

    const cliente = await getCliente();

    if (!cliente) return;
    const Total = obtenerTotal();
    const facturaPayload = getFacturaPayload(
      cliente,
      Total,
      currentSede,
      carrito
    );

    const result = await Swal.fire({
      title: "¿Está seguro?",
      text: `Se generará una factura por un total de $${Total.toFixed(2)}. 
 Para el cliente: ${cliente.Nombre} ${cliente.Apellidos} ¿Desea continuar?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, generar factura",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) {
      Swal.fire("Cancelado", "La factura no fue generada.", "info");
      limpiarCarrito();
      return;
    }

    setIsLoading(true);
    const exito = await postFactura(facturaPayload);

    if (exito) {
      Swal.fire("Éxito", "Factura generada correctamente.", "success");
      limpiarCarrito();
      navigate("/dummy", { replace: true });
      setTimeout(() => {
        navigate("/facturacion");
      }, 50);
    } else {
      Swal.fire("Error", "No se pudo generar la factura.", "error");
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className={styles["acciones-factura"]}>
        <button
          className={styles["btn-accion"]}
          onClick={generarFactura}
          disabled={isLoading}
        >
          Generar Factura
        </button>
        <button
          className={styles["btn-accion"]}
          onClick={() => limpiarCarrito()}
          disabled={isLoading}
        >
          Cancelar Factura
        </button>
      </div>

      <Backdrop
        open={isLoading}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}
