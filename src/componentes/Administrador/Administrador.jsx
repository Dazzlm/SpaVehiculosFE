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
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Swal from "sweetalert2";

const ListaAdministradores = () => {
  const [administradores, setAdministradores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    cargarAdministradores();
  }, []);

  const cargarAdministradores = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("CurrentUser"));
      if (!user?.token) {
        throw new Error("No estás autenticado.");
      }

      const response = await fetch("https://spavehiculos.runasp.net/api/GestorAdmin/ConsultarTodos", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener administradores");
      }

      setAdministradores(data);
    } catch (error) {
      console.error("Error al obtener administradores:", error);
      Swal.fire("Error", error.message || "Error al obtener administradores", "error");
    }
  };

  const eliminarAdministrador = async (id) => {
    const user = JSON.parse(localStorage.getItem("CurrentUser"));
    if (!user?.token) {
      Swal.fire("Error", "No estás autenticado.", "error");
      return;
    }

    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará al administrador.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        const response = await fetch(
          `https://spavehiculos.runasp.net/api/GestorAdmin/EliminarAdminUsuario?idAdmin=${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Error al eliminar el administrador.");
        }

        await Swal.fire("Eliminado", "El administrador ha sido eliminado correctamente.", "success");
        cargarAdministradores();
      } catch (error) {
        console.error("Error al eliminar administrador:", error);
        Swal.fire("Error", "Ocurrió un error al eliminar el administrador.", "error");
      }
    }
  };

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
          <AdminPanelSettingsIcon sx={{ fontSize: 36, color: "#444" }} />
          <Typography variant="h5" fontWeight="bold">
            Lista de Administradores
          </Typography>
        </Stack>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/usuarios/administrador/crear")}
        >
          Crear Administrador
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
                <TableCell><b>Nombre</b></TableCell>
                <TableCell><b>Email</b></TableCell>
                <TableCell><b>Cargo</b></TableCell>
                <TableCell align="center"><b>Acciones</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {administradores.length > 0 ? (
                administradores.map((admin) => (
                  <TableRow
                    key={admin.IdAdmin}
                    hover
                    sx={{ transition: "0.2s", "&:hover": { backgroundColor: "#f0f0f0" } }}
                  >
                    <TableCell>{admin.IdAdmin}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar sx={{ width: 36, height: 36 }}>
                          {admin.Nombre?.[0]}
                        </Avatar>
                        <Typography>{admin.Nombre} {admin.Apellidos}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{admin.Email}</TableCell>
                    <TableCell>{admin.Cargo}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Ver">
                          <IconButton color="primary" onClick={() => navigate(`/usuarios/administrador/ver/${admin.IdAdmin}`)}>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton color="success" onClick={() => navigate(`/usuarios/administrador/editar/${admin.IdAdmin}`)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton color="error" onClick={() => eliminarAdministrador(admin.IdAdmin)}>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: "gray" }}>
                    No hay administradores registrados.
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

export default ListaAdministradores;
