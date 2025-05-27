
export function filtrarProductosPorIds(detallesFactura, productos) {
  if (!detallesFactura || !Array.isArray(detallesFactura)) {
    return [];
  }
  return detallesFactura.map((detalle) => {
    const productoInfo = productos.find(
      (producto) => producto.IdProducto === detalle.IdProducto
    );

    return {
      ...detalle,
      ...productoInfo, 
    };
  });
}


export function filtrarServiciosPorIds(detallesFactura, productos) {
  if (!detallesFactura || !Array.isArray(detallesFactura)) {
    return [];
  }
  return detallesFactura.map((detalle) => {
    const servicioInfo = productos.find(
      (servicio) => servicio.IdServicio === detalle.IdServicio
    );

    return {
      ...detalle,
      ...servicioInfo,
    };
  });
}


