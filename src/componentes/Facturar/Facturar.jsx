import { useNavigate } from "react-router-dom";
import { Button, Tooltip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import styles from "./Facturar.module.css";
import ListProductos from "../list-productos/ListProductos.jsx";
import ListServicios from "../list-servicios/ListServicios.jsx";
import ListCart from "../list-cart/ListCart.jsx";
import AccionesFactura from "../acciones-factura/AccionesFactura.jsx";
import { useSpaVehiculosStore } from "../../zustand/SpaVehiculosStore.js";
import { getSedeID } from "../../helpers/Sedes/getSedeID.js";
import TooltipComponent from "../TooltipComponent/TooltipComponent.jsx";
import { useState, useEffect } from "react";

export default function Facturar() {
  const [sede, setSede] = useState(null);
  const navigate = useNavigate();
  const { currentSede } = useSpaVehiculosStore();
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!currentSede) {
          return;
        }

        const sedeData = await getSedeID(currentSede);
        if (!sedeData) {
          console.error("No se encontró la sede con ID:", currentSede);
          return;
        }
        setSede(sedeData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentSede]);

  return (
    <div className={styles["container-facturar"]}>
      <div className={styles["container-header"]}>
        <Button
          className="button-back"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/facturacion")}
        >
          Regresar
        </Button>
        {sede && (
          <div className={styles["container-info"]}>
            <h1> Facturacion en sede: {sede.Nombre} </h1>
          </div>
        )}
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
          <div className={styles["container-resumen-header"]}>
            <h2 className={styles["titulo"]}>Resumen de la Factura</h2>
            <TooltipComponent tooltipText="Puedes cambiar de sede sin perder los productos seleccionados" />
          </div>

          <ListCart />
          <div className={styles["acciones-factura"]}>
            <AccionesFactura />
          </div>
        </div>
      </div>
    </div>
  );
}
