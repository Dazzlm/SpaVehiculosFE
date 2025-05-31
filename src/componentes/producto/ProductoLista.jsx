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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InventoryIcon from "@mui/icons-material/Inventory";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSpaVehiculosStore } from "../../zustand/SpaVehiculosStore";

const ListaProductos = () => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useSpaVehiculosStore();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("CurrentUser"));
    const token = currentUser?.token || storedUser?.token;

    if (!token) {
      console.warn("No se encontró token, no se realizará la petición.");
      return;
    }

    console.log("Token para autorización:", token);

    fetch("http://spavehiculos.runasp.net/api/Productos/ObtenerTodos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setProductos(data.data);
        } else {
          console.error("Error: respuesta no exitosa", data);
        }
      })
      .catch((error) =>
        console.error("Error al obtener productos:", error.message)
      );
  }, [currentUser]);

  return (
    <Box
      sx={{ width: "100%", maxWidth: "1200px", mx: "auto", py: 3, px: { xs: 1, sm: 2, md: 3 } }}
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
        <Stack paddingLeft={5} direction="row" alignItems="center" spacing={1}>
          <InventoryIcon sx={{ fontSize: 36, color: "#444" }} />
          <Typography variant="h5" fontWeight="bold">
            Lista de Productos
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1}>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/gestion/productos/crear")}
          >
            Crear Producto
          </Button>
        </Stack>
      </Stack>

      <Box sx={{ overflowX: "auto" }}>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            minWidth: 800,
            maxHeight: 600,
            overflowY: "auto",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>
                  <b>ID</b>
                </TableCell>
                <TableCell>
                  <b>Nombre</b>
                </TableCell>
                <TableCell>
                  <b>Descripción</b>
                </TableCell>
                <TableCell>
                  <b>Precio</b>
                </TableCell>
                <TableCell>
                  <b>ID Proveedor</b>
                </TableCell>
                <TableCell align="center">
                  <b>Acciones</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productos.length > 0 ? (
                productos.map((producto) => (
                  <TableRow
                    key={producto.IdProducto}
                    hover
                    sx={{
                      transition: "0.2s",
                      "&:hover": { backgroundColor: "#f0f0f0" },
                    }}
                  >
                    <TableCell>{producto.IdProducto}</TableCell>
                    <TableCell>{producto.Nombre}</TableCell>
                    <TableCell>{producto.Descripción}</TableCell>
                    <TableCell>${producto.Precio}</TableCell>
                    <TableCell>{producto.IdProveedor}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            navigate(`/gestion/productos/ver/${producto.IdProducto}`)
                          }
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          color="success"
                          onClick={() =>
                            navigate(`/gestion/productos/editar/${producto.IdProducto}`)
                          }
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() =>
                            navigate(`/gestion/productos/eliminar/${producto.IdProducto}`)
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
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: "gray" }}>
                    No hay productos registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ListaProductos;
