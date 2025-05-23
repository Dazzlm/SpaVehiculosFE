
import Menu from '../../componentes/menu/Menu';
import  Sidebar from '../../componentes/sidebar/Sidebar';
import Topbar from'../../componentes/topbar/Topbar';
import { Outlet } from "react-router-dom";
import  styles from './Mainlayout.module.css';
export default function Mainlayout( ) {
  return (
    <div className={styles["main__layout"]}>
      <Sidebar className={styles["main__layout--sidebar"]} />
      <div className={styles["main__layout--content"]}>
        <Topbar  />
        <Menu >
           <Outlet />
        </Menu>  
      </div>
      
    </div>
  )
}
