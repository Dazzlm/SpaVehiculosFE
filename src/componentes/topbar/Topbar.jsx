import styles from "./Topbar.module.css";
import ListSedes from "../ListSedes/ListSedes.jsx";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSpaVehiculosStore } from "../../zustand/SpaVehiculosStore.js";
import TooltipComponent from "../TooltipComponent/TooltipComponent.jsx";
import {useLocation} from "react-router-dom";
export default function Topbar() {
  const { clearCurrentUser, limpiarCarrito } = useSpaVehiculosStore();
  const location = useLocation();
  const currentLocation = location.pathname;

  const show = (currentLocation.includes("facturacion/registrar") || currentLocation.includes("stock") );

  const handleLogout = () => {
    limpiarCarrito();
    localStorage.clear();
    clearCurrentUser();
  };

  return (
    <div className={styles["topbar"]}>
      <p className={styles["topbar__title"]}>Dashboard </p>

      <div className={ show? styles["topbar__container--sedes"] : styles["topbar__container--sedes--hidden"]}>
        <ListSedes />
        <TooltipComponent tooltipText="Seleccionar sede donde desea hacer la gestion" />
      </div>
      <div className={styles["topbar__container--logout"]}>
        <Button
          variant="contained"
          color="error"
          size="small"
          startIcon={<LogoutIcon />}
          
          onClick={handleLogout}
        >
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
