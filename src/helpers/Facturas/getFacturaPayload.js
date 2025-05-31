
export function getFacturaPayload( cliente, total, currentSede, carrito) {

    const facturaPayload = {
      Factura: {
        IdFactura: 0,
        Fecha: new Date().toISOString(),
        IdCliente: cliente.IdCliente,
        Total: total,
        IdSede: currentSede,
      },
      Productos: carrito.productos.map((p) => ({
        IdDetalle: 0,
        IdFactura: 0,
        IdProducto: p.IdProducto,
        Cantidad: p.cantidad || 1,
        Subtotal: parseFloat((p.Precio * (p.cantidad || 1)).toFixed(2)),
      })),
      Servicios: carrito.servicios.map((s) => ({
        IdDetalle: 0,
        IdFactura: 0,
        IdServicio: s.IdServicio,
        Subtotal: parseFloat(s.Precio.toFixed(2)),
      }))
    }
      return facturaPayload;
}       