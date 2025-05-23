import styles from "./Menu.module.css";
export  default function Menu({ children }) {
  return (
    <div className={styles["menu"]}>
      <h1 className={styles["menu__title"]}>Bienvenido!</h1>
      {children}
    </div>
  )
}