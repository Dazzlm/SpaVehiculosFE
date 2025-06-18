import styles from "./Topbar.module.css";
import ListSedes from "../ListSedes/ListSedes.jsx";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import { useSpaVehiculosStore } from "../../zustand/SpaVehiculosStore.js";
export default function Topbar() {
  const { clearCurrentUser, limpiarCarrito } = useSpaVehiculosStore();

  const handleLogout = () => {
    limpiarCarrito();
    localStorage.clear();
    clearCurrentUser();
  };

  return (
    <div className={styles["topbar"]}>
      <p className={styles["topbar__title"]}>Dashboard </p>

      <div className={styles["topbar__container--sedes"]}>
        <ListSedes />
      </div>
      <Button
        variant="contained"
        color="error"
        size="small"
        startIcon={<LogoutIcon />}
        className={styles["topbar__logout"]}
        onClick={handleLogout}
      >
        Cerrar sesión
      </Button>
    </div>
  );
}
