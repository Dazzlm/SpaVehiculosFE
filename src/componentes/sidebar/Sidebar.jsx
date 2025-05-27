import { Link, useLocation } from "react-router-dom";

import { useState } from "react";
import optionsSidebar from "../../helpers/optionsSidebar.jsx";
import styles from "./Sidebar.module.css";
export default function Sidebar({ className }) {
  const location = useLocation();

  return (
    <div className={className}>
      <h1 className={styles["sidebar__title"]}>SPA Vehículos</h1>
      <div className={styles["sidebar__container"]}>
        {optionsSidebar.map((option) => {
          const isActive = location.pathname.includes(option.Path) && option.Path !== "/";

          return (
            <Link
              key={option.id}
              to={option.Path}
              className={`${styles["sidebar__link"]} ${isActive ? styles["sidebar__link--active"] : ""}`}
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


