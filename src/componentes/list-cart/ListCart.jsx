import ItemCart from "../item-cart/ItemCart";
import styles from "./ListCart.module.css";
import { useSpaVehiculosStore } from "../../zustand/SpaVehiculosStore.js";

export default function ListCart() {
  const carrito = useSpaVehiculosStore((state) => state.carrito);
  const { obtenerTotal } = useSpaVehiculosStore();

  const isEmpty = carrito.productos.length === 0 && carrito.servicios.length === 0;

  return (
   <div className={styles["container"]}>
  {carrito.productos.length === 0 && carrito.servicios.length === 0 ? (
    <div className={styles["empty-cart"]}> 
        <img 
                className={styles["empty-cart-image"]}
                src="src/assets/imagenes/emptyCart.png"
                alt="Carrito vacío"
            />
        <p className={styles["empty-cart"]}>No hay productos o servicios en el carrito</p>
            
    </div>
  ) : (
    <>
      <div className={styles["scrollable-list"]}>
        {carrito.productos.length !== 0 && (
          <div className={styles["list-cart-productos"]}>
            {carrito.productos.map((item, index) => (
              <ItemCart key={index} item={item} type={"Producto"} />
            ))}
          </div>
        )}
        {carrito.servicios.length !== 0 && (
          <div className={styles["list-cart-servicios"]}>
            {carrito.servicios.map((item) => (
              <ItemCart
                key={item.IdProducto || item.IdServicio}
                item={item}
                type={"Servicio"}
              />
            ))}
          </div>
        )}
      </div>
      <div className={styles["total-container"]}>
        <h3 className={styles["total-title"]}>Total:</h3>
        <p className={styles["total-amount"]}>
          ${obtenerTotal().toFixed(2)}
        </p>
      </div>
      
    </>
  )}
  
</div>

  );
}
