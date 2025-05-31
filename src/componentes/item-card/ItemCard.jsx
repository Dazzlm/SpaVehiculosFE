import styles from "./ItemCard.module.css";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import productoImg from "../../assets/imagenes/producto.png";
import servicioImg from "../../assets/imagenes/servicio.png";

import { useSpaVehiculosStore } from "../../zustand/SpaVehiculosStore.js";

export default function ItemCard({ item, type }) {
  const agregarProducto = useSpaVehiculosStore(state => state.agregarProducto);
  const eliminarProducto = useSpaVehiculosStore(state => state.eliminarProducto);
  const agregarServicio = useSpaVehiculosStore(state => state.agregarServicio);
  const eliminarServicio = useSpaVehiculosStore(state => state.eliminarServicio);

  const enCarrito = useSpaVehiculosStore((state) => {
    if (type === "Producto") {
      return state.carrito.productos.some(p => p.IdProducto === item.IdProducto);
    } else if (type === "Servicio") {
      return state.carrito.servicios.some(s => s.IdServicio === item.IdServicio);
    }
    return false;
  });

  let imageUrl = "";
  switch (type) {
    case "Servicio":
      imageUrl = servicioImg;
      break;
    case "Producto":
      imageUrl = productoImg;
      break;
}


  const toggleCarrito = () => {
    if (!enCarrito) {
      if (type === "Producto") {
        agregarProducto({ ...item, cantidad: 1 });
      } else if (type === "Servicio") {
        agregarServicio(item);
      }
    } else {
      if (type === "Producto") {
        eliminarProducto(item.IdProducto);
      } else if (type === "Servicio") {
        eliminarServicio(item.IdServicio);
      }
    }
  };

  return (
    <div className={styles["item-card"]}>
      <div className={styles["item-card-info"]} onClick={toggleCarrito}>
        <img className={styles["item-card-image"]} src={imageUrl} alt={item.Nombre} />
        <div className={styles["item-card-content"]}>
          <h3 className={styles["item-card-title"]}>{item.Nombre}</h3>
          {type === "Producto" && (
            <p className={styles["item-card-Stock"]}>Stock: {item.Stock}</p>
          )}
          <p className={styles["item-card-price"]}>Precio: $ {item.Precio.toLocaleString()}</p>
        </div>
      </div>

      <button
        className={styles["item-card-button"]}
        onClick={(e) => {
          e.stopPropagation();
          toggleCarrito();
        }}
      >
        {enCarrito ? <DeleteIcon /> : <AddIcon />}
        {enCarrito ? "Eliminar del carrito" : "Agregar"}
      </button>
    </div>
  );
}
