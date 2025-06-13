import { Link, useLocation } from "react-router-dom";

import { useState } from "react";
import optionsSidebar from "../../helpers/optionsSidebar.jsx";
import styles from "./Sidebar.module.css";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
export default function Sidebar( ) {
  const location = useLocation();

  return (
    <div className={styles["main__layout--sidebar"]}>
      <div className={styles["sidebar__header"]}>
        <h1 className={styles["sidebar__title"]}>SPA Vehículos</h1>
        <div className={styles["sidebar__toggle"]} onClick={() => {
          const sidebar = document.querySelector(`.${styles["sidebar__container"]}`);
          sidebar.classList.toggle(styles["sidebar__container--collapsed"]);
        }}>
          <MenuOpenIcon />
        </div>
      </div>
      

      <div className={styles["sidebar__container"]}>
        {optionsSidebar.map((option) => {
          const isActive = location.pathname.includes(option.Path) && option.Path !== "/";

          return (
            <Link
              key={option.id}
              to={option.Path}
              className={`${styles["sidebar__link"]} ${isActive ? styles["sidebar__link--active"] : ""}`}
              onClick={() => {
                const sidebar = document.querySelector(`.${styles["sidebar__container"]}`);
                sidebar.classList.toggle(styles["sidebar__container--collapsed"]);
              }}
            >
              {option.icon}
              <span className={styles["sidebar__link-text"]}>{option.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}


