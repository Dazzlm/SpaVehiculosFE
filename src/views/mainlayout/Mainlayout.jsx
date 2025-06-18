import Menu from "../../componentes/menu/Menu";
import Sidebar from "../../componentes/sidebar/Sidebar";
import Topbar from "../../componentes/topbar/Topbar";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import styles from "./Mainlayout.module.css";
import { useSpaVehiculosStore } from "../../zustand/SpaVehiculosStore.js";
import { isTokenExpired } from "../../helpers/Auth/isTokenExpired.js";
import { useEffect } from "react";

export default function Mainlayout() {
  const { currentUser, clearCurrentUser } = useSpaVehiculosStore();
  const navigate = useNavigate();

  const user =
    currentUser || JSON.parse(localStorage.getItem("CurrentUser") || "null");

  useEffect(() => {
    if (!user || isTokenExpired(user.exp)) {
      clearCurrentUser();
      navigate("/login", { replace: true });
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const storedUser = JSON.parse(
        localStorage.getItem("CurrentUser") || "null"
      );
      if (!storedUser || (storedUser?.exp && isTokenExpired(storedUser.exp))) {
        clearCurrentUser();
        localStorage.clear();
        navigate("/login", { replace: true });
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (!user || isTokenExpired(user.exp)) {
    return <Navigate to="/login" replace={true} />;
  }

  return (
    <div className={styles["main__layout"]}>
      <Sidebar className={styles["main__layout--sidebar"]} />
      <div className={styles["main__layout--content"]}>
        <Topbar />
        <Menu>
          <Outlet />
        </Menu>
      </div>
    </div>
  );
}
