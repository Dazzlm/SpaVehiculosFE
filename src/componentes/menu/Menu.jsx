import styles from "./Menu.module.css";
export  default function Menu({ children }) {
  return (
    <div className={styles["menu"]}>
      {children}
    </div>
  )
}