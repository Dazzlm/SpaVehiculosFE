

export const useCarritoStore = ((set, get) => ({
  carrito: {
    productos: [],
    servicios: [],
  },

  // ----------------------
  // Productos
  // ----------------------
  agregarProducto: (producto) => {
    const { IdProducto, Stock } = producto;
    const { productos } = get().carrito;

    const existe = productos.find((p) => p.IdProducto === IdProducto);
    if (!existe) {
      set((state) => ({
        carrito: {
          ...state.carrito,
          productos: [...productos, { ...producto, cantidad: 1, Stock }],
        },
      }));
    }
  },

  eliminarProducto: (IdProducto) => {
    set((state) => ({
      carrito: {
        ...state.carrito,
        productos: state.carrito.productos.filter(p => p.IdProducto !== IdProducto),
      },
    }));
  },

  aumentarCantidadProducto: (IdProducto) => {
    set((state) => ({
      carrito: {
        ...state.carrito,
        productos: state.carrito.productos.map(p => {
          if (p.IdProducto === IdProducto) {
            const nuevaCantidad = Math.min(p.cantidad + 1, p.Stock);
            return { ...p, cantidad: nuevaCantidad };
          }
          return p;
        }),
      },
    }));
  },

  disminuirCantidadProducto: (IdProducto) => {
    set((state) => ({
      carrito: {
        ...state.carrito,
        productos: state.carrito.productos.map(p => {
          if (p.IdProducto === IdProducto) {
            const nuevaCantidad = Math.max(p.cantidad - 1, 1);
            return { ...p, cantidad: nuevaCantidad };
          }
          return p;
        }),
      },
    }));
  },

  estaProductoEnCarrito: (IdProducto) => {
    return get().carrito.productos.some(p => p.IdProducto === IdProducto);
  },

  // ----------------------
  // Servicios
  // ----------------------
  agregarServicio: (servicio) => {
    const { IdServicio } = servicio;
    const { servicios } = get().carrito;

    const existe = servicios.find(s => s.IdServicio === IdServicio);
    if (!existe) {
      set((state) => ({
        carrito: {
          ...state.carrito,
          servicios: [...servicios, servicio],
        },
      }));
    }
  },

  eliminarServicio: (IdServicio) => {
    set((state) => ({
      carrito: {
        ...state.carrito,
        servicios: state.carrito.servicios.filter(s => s.IdServicio !== IdServicio),
      },
    }));
  },

  estaServicioEnCarrito: (IdServicio) => {
    return get().carrito.servicios.some(s => s.IdServicio === IdServicio);
  },

  // ----------------------
  // Utilidades
  // ----------------------
  limpiarCarrito: () => set({ carrito: { productos: [], servicios: [] } }),

  obtenerTotal: () => {
    const { productos, servicios } = get().carrito;

    const totalProductos = productos.reduce(
      (acc, p) => acc + p.Precio * p.cantidad,
      0
    );

    const totalServicios = servicios.reduce(
      (acc, s) => acc + s.Precio,
      0
    );

    return totalProductos + totalServicios;
  },
}));
