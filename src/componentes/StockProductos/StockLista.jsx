import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  IconButton,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InventoryIcon from "@mui/icons-material/Inventory2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSpaVehiculosStore } from "../../zustand/SpaVehiculosStore";

const StockLista = () => {
  const [stockPorProducto, setStockPorProducto] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentSede } = useSpaVehiculosStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem("CurrentUser"));
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        };

        const res = await fetch(
          `https://spavehiculos.runasp.net/api/StockSedes/ConsultarPorID?idSedeProducto=${currentSede}`,
          { headers }
        );
        const data = await res.json();

        if (!res.ok) throw new Error(data.Message || "Error al obtener stock");

        const productosCompletos = await Promise.all(
          data.Data.map(async (item) => {
            const productoRes = await fetch(
              `https://spavehiculos.runasp.net/api/Productos/ObtenerPorId?id=${item.IdProducto}`,
              { headers }
            );
            const dataprod = await productoRes.json();
            const producto = dataprod.Data;

            if (!productoRes.ok) throw new Error(producto.message);

            return {
              IdProducto: item.IdProducto,
              Id: item.Id,
              Nombre: producto.Nombre,
              Descripción: producto.Descripción,
              Precio: producto.Precio,
              StockDisponible: item.StockDisponible,
            };
          })
        );

        setStockPorProducto(productosCompletos);
      } catch (error) {
        console.error("Error al obtener productos con stock:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentSede]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1200px",
        mx: "auto",
        py: 3,
        px: { xs: 1, sm: 2, md: 3 },
        maxHeight: "85vh",
        overflowY: "auto",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        mb={3}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/gestion")} 
        >
          Regresar
        </Button>

        <Stack direction="row" alignItems="center" spacing={1}>
          <InventoryIcon sx={{ fontSize: 36, color: "#444" }} />
          <Typography variant="h5" fontWeight="bold">
            Productos con Stock Disponible
          </Typography>
        </Stack>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/gestion/stock/crear")}
        >
          Añadir Producto
        </Button>
      </Stack>

      {loading ? (
        <Box display="flex" justifyContent="center" py={5}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            maxHeight: "65vh",
            overflowY: "auto",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell><b>ID Producto</b></TableCell>
                <TableCell><b>Nombre</b></TableCell>
                <TableCell><b>Descripción</b></TableCell>
                <TableCell><b>Precio</b></TableCell>
                <TableCell><b>Stock</b></TableCell>
                <TableCell align="center"><b>Acciones</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stockPorProducto.length > 0 ? (
                stockPorProducto.map((producto) => (
                  <TableRow key={producto.IdProducto} hover>
                    <TableCell>{producto.IdProducto}</TableCell>
                    <TableCell>{producto.Nombre}</TableCell>
                    <TableCell>{producto.Descripción}</TableCell>
                    <TableCell>${producto.Precio.toLocaleString()}</TableCell>
                    <TableCell>{producto.StockDisponible}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton
                          color="success"
                          onClick={() =>
                            navigate(`/gestion/stock/editar/${producto.Id}`)
                          }
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => 
                            navigate(`/gestion/stock/eliminar/${producto.Id}`)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    No hay productos con stock registrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default StockLista;

