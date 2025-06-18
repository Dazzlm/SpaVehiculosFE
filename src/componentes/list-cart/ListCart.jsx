import ItemCart from "../item-cart/ItemCart";
import styles from "./ListCart.module.css";
import emptyCart from "../../assets/imagenes/emptyCart.png";
import { useSpaVehiculosStore } from "../../zustand/SpaVehiculosStore.js";
import { useEffect } from "react";
export default function ListCart() {
  const carrito = useSpaVehiculosStore((state) => state.carrito);
  const setCarrito = useSpaVehiculosStore((state) => state.setCarrito);
  const idSede = useSpaVehiculosStore((state) => state.currentSede);
  const limpiarCarrito = useSpaVehiculosStore((state) => state.limpiarCarrito);
  const setIdSedeCarrito = useSpaVehiculosStore(
    (state) => state.setIdSedeCarrito
  );
  const { obtenerTotal } = useSpaVehiculosStore();

  useEffect(() => {
    // Recuperar carrito desde localStorage para la sede actual
    const stored = localStorage.getItem("Carrito" + idSede);
    let parsedCarrito;

    try {
      parsedCarrito = stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Error al parsear carrito:", error);
      parsedCarrito = null;
    }

    if (parsedCarrito) {
      setCarrito(parsedCarrito);
    } else {
      limpiarCarrito(); // limpia el estado de zustand
      localStorage.setItem(
        "Carrito" + idSede,
        JSON.stringify({ productos: [], servicios: [] })
      );
    }

    setIdSedeCarrito(idSede);
  }, [idSede]);
  useEffect(() => {
    if (idSede) {
      localStorage.setItem("Carrito" + idSede, JSON.stringify(carrito));
    }
  }, [carrito, idSede]);

  return (
    <div className={styles["container"]}>
      {carrito.productos.length === 0 && carrito.servicios.length === 0 ? (
        <div className={styles["empty-cart"]}>
          <img
            className={styles["empty-cart-image"]}
            src={emptyCart}
            alt="Carrito vacío"
          />
          <p className={styles["empty-cart"]}>
            No hay productos o servicios en el carrito
          </p>
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
              ${obtenerTotal().toLocaleString()}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
