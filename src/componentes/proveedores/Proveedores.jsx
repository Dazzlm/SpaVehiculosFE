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
  Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PeopleIcon from "@mui/icons-material/People";

const ListaProveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("CurrentUser"));

fetch("https://spavehiculos.runasp.net/api/GestorProv/ConsultarTodos", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user?.token}`,
  },
})
  .then((response) => response.json())
  .then((data) => setProveedores(data.Data))
  .catch((error) => console.error("Error al obtener proveedores:", error));

  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1200px",
        mx: "auto",
        py: 3,
        px: { xs: 1, sm: 2, md: 3 },
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
          onClick={() => navigate("/usuarios")}
        >
          Regresar
        </Button>

        <Stack direction="row" alignItems="center" spacing={1}>
          <PeopleIcon sx={{ fontSize: 36, color: "#444" }} />
          <Typography variant="h5" fontWeight="bold">
            Lista de Proveedores
          </Typography>
        </Stack>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/usuarios/proveedor/crear")}
        >
          Crear Proveedor
        </Button>
      </Stack>

      <Box sx={{ overflowX: "auto" }}>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            minWidth: 800,
            maxHeight: 700,
            overflowY: "auto",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell><b>ID</b></TableCell>
                <TableCell><b>Empresa</b></TableCell>
                <TableCell><b>Contacto</b></TableCell>
                <TableCell><b>Teléfono</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell align="center"><b>Acciones</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {proveedores.length > 0 ? (
                proveedores.map((proveedor) => (
                  <TableRow
                    key={proveedor.IdProveedor}
                    hover
                    sx={{
                      transition: "0.2s",
                      "&:hover": { backgroundColor: "#f0f0f0" },
                    }}
                  >
                    <TableCell>{proveedor.IdProveedor}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar sx={{ width: 36, height: 36 }}>
                          {proveedor.NombreEmpresa?.[0]}
                        </Avatar>
                        <Typography>{proveedor.NombreEmpresa}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{proveedor.Contacto}</TableCell>
                    <TableCell>{proveedor.Teléfono}</TableCell>
                    <TableCell>{proveedor.Email}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton
                          color="primary"
                          onClick={() =>
                            navigate(`/usuarios/proveedor/ver/${proveedor.IdProveedor}`)
                          }
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          color="success"
                          onClick={() =>
                            navigate(`/usuarios/proveedor/editar/${proveedor.IdProveedor}`)
                          }
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() =>
                            navigate(`/usuarios/proveedor/eliminar/${proveedor.IdProveedor}`)
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
                    No hay proveedores registrados.
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

export default ListaProveedores;
