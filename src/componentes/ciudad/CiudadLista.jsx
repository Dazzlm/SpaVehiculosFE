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
import PlaceIcon from "@mui/icons-material/Place";
import { useSpaVehiculosStore } from "../../zustand/SpaVehiculosStore";

const ListaCiudades = () => {
  const [ciudades, setCiudades] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useSpaVehiculosStore();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("CurrentUser"));
    const token = currentUser?.token || storedUser?.token;

    if (!token) {
      console.warn("No se encontró token, no se realizará la petición.");
      return;
    }

    fetch("http://spavehiculos.runasp.net/api/Ciudades/ConsultarTodos", {
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
        const ciudadesOrdenadas = data.sort((a, b) => a.IdCiudad - b.IdCiudad);
        setCiudades(ciudadesOrdenadas);
      })
      .catch((error) => console.error("Error al obtener ciudades:", error));
  }, [currentUser]);

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "800px",
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
        <Stack paddingLeft={35} direction="row" alignItems="center" spacing={1}>
          <PlaceIcon sx={{ fontSize: 36, color: "#444" }} />
          <Typography variant="h5" fontWeight="bold">
            Lista de Ciudades
          </Typography>
        </Stack>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/ciudades/crear")}
        >
          Crear Ciudad
        </Button>
      </Stack>

      <Box sx={{ overflowX: "auto" }}>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            minWidth: 400,
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
                <TableCell align="center">
                  <b>Acciones</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ciudades.length > 0 ? (
                ciudades.map((ciudad) => (
                  <TableRow
                    key={ciudad.IdCiudad}
                    hover
                    sx={{
                      transition: "0.2s",
                      "&:hover": { backgroundColor: "#f0f0f0" },
                    }}
                  >
                    <TableCell>{ciudad.IdCiudad}</TableCell>
                    <TableCell>
                      <Typography>{ciudad.Nombre}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/ciudades/ver/${ciudad.IdCiudad}`)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          color="success"
                          onClick={() => navigate(`/ciudades/editar/${ciudad.IdCiudad}`)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => navigate(`/ciudades/eliminar/${ciudad.IdCiudad}`)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4, color: "gray" }}>
                    No hay ciudades registradas.
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

export default ListaCiudades;
