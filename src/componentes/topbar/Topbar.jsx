import TextField from '@mui/material/TextField';
import styles from './Topbar.module.css';
import ListSedes from '../ListSedes/ListSedes.jsx';
export default function Topbar() {
  return (
    <div className={styles["topbar"]} >
      <p className={styles["topbar__title"]}>Dashboard </p>
      <div className={styles["topbar__search"]}>
        <TextField id="standard-basic" label="Buscar" variant="standard" />
        <button className={styles["topbar__search-button"]}>🔍︎</button>
      </div>
      <div className={styles["topbar__container--sedes"]}>
        <ListSedes />
      </div>
    </div>
  )
}
