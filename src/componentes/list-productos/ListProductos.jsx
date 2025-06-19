import ItemCard from "../item-card/ItemCard";
import styles from "./ListProductos.module.css";
import { getProductosSede } from "../../helpers/Productos/getProductosSede.js";
import { useState, useEffect } from "react";
import { useSpaVehiculosStore } from "../../zustand/SpaVehiculosStore.js";
import TooltipComponent from "../TooltipComponent/TooltipComponent.jsx";
export default function ListProductos() {
  const [productos, setProductos] = useState([]);
  const currentSede = useSpaVehiculosStore((state) => state.currentSede);
  const isSedeLoaded = useSpaVehiculosStore((state) => state.isSedeLoaded);

  useEffect(() => {
    if (isSedeLoaded) {
      const fetchData = async () => {
        const result = await getProductosSede(currentSede);

        if (result === undefined || result === null) {
          setProductos([]);
          return;
        }

        setProductos(result);
      };
      fetchData();
    }
  }, [currentSede, isSedeLoaded]);

 return (
  <div className={styles["container"]}>
    <div className={styles["header"]}>
      <h2 className={styles["titulo"]}>Elige los Productos a facturar
      </h2>
      <TooltipComponent tooltipText="Los productos se muestran segun el stock de la sede, puedes cambiar la sede arriba" />
    </div>
    
    {productos.length === 0 ? (
      "No hay productos disponibles"
    ) : (
      <div className={styles["scroll-container"]}>
        <div className={styles["list-productos"]}>
          {productos.map((item, index) => (
            <ItemCard key={index} item={item} type={"Producto"} />
          ))}
        </div>
      </div>
    )}
  </div>
);

}
