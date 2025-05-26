import ItemCard from "../item-card/ItemCard";
import styles from "./ListServicios.module.css";
import { getServicios } from "../../helpers/getServicios";
import { useState, useEffect } from "react";
export default function ListServicios() {
    const [servicios, setServicios] = useState([]);
    // Fetch data from API
  useEffect(() => {
    
          const fetchData = async () => { 
              const result = await getServicios();

              if (result === undefined || result === null) {
                  setServicios([]);
                  console.error("Error fetching data");
                  return;
              }
              console.log(result);

              setServicios(result);
          };
          fetchData();
     
}, []);
    
  return (
    <div className={styles["container"]}>
      {servicios.length == 0 ? "No hay servicios disponibles" :
      <>
      <h2 className={styles["titulo"]}>Elige los Servicios a facturar</h2>
      <div className={styles["list-servicios"]}>
      {servicios.map((item, index) => (
        <ItemCard key={index} item={item} type={"Servicio"} />
      ))}
      </div>
      </>
    }
    </div>
  );
}