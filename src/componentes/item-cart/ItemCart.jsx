import React from 'react';
import { useSpaVehiculosStore } from "../../zustand/SpaVehiculosStore.js";
import styles from "./ItemCart.module.css";
import { IconButton, Typography, Paper } from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';

export default function ItemCart({ item, type }) {
  const {
    eliminarProducto,
    aumentarCantidadProducto,
    disminuirCantidadProducto,
    eliminarServicio
  } = useSpaVehiculosStore();

  const cantidad = item.cantidad || 1;
  const subtotal = (item.Precio * cantidad).toFixed(2);

  return (
    <Paper elevation={3} className={styles["item-cart"]}>
      <div className={styles["left"]}>
        <Typography className={styles["item-name"]} title={item.Nombre} variant="subtitle1" noWrap>
          {item.Nombre}
        </Typography>
        <Typography className={styles["item-price"]} variant="body2">
          ${item.Precio.toFixed(2)}
        </Typography>
      </div>

      <div className={styles["center"]}>
        {type === "Producto" ? (
          <>
            <IconButton size="small" onClick={() => disminuirCantidadProducto(item.IdProducto)}>
              <Remove />
            </IconButton>
            <Typography className={styles["qty-value"]}>{cantidad}</Typography>
            <IconButton size="small" onClick={() => aumentarCantidadProducto(item.IdProducto)}>
              <Add />
            </IconButton>
          </>
        ) : (
          <Typography className={styles["qty-value"]}>x1</Typography>
        )}
      </div>

      <div className={styles["right"]}>
        <Typography className={styles["item-subtotal"]} variant="body2">
          ${subtotal}
        </Typography>
        <IconButton
          size="small"
          color="error"
          onClick={() =>
            type === "Producto"
              ? eliminarProducto(item.IdProducto)
              : eliminarServicio(item.IdServicio)
          }
        >
          <Delete />
        </IconButton>
      </div>
    </Paper>
  );
}

