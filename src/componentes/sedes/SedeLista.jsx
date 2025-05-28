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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationCityIcon from "@mui/icons-material/LocationCity";

const ListaSedes = () => {
  const [sedes, setSedes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://spavehiculos.runasp.net/api/Sedes/ConsultarTodos")
      .then((response) => response.json())
      .then((data) => setSedes(data))
      .catch((error) => console.error("Error al obtener sedes:", error));
  }, []);

  return (
    <Box sx={{ width: "100%", maxWidth: "1200px", mx: "auto", py: 3, px: { xs: 1, sm: 2, md: 3 } }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        mb={3}
      >

        <Stack paddingLeft={60} direction="row" alignItems="center" spacing={1}>
          <LocationCityIcon sx={{ fontSize: 36, color: "#444" }} />
          <Typography variant="h5" fontWeight="bold">
            Lista de Sedes
          </Typography>
        </Stack>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/sedes/crear")}
        >
          Crear Sede
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
                <TableCell><b>Dirección</b></TableCell>
                <TableCell><b>Teléfono</b></TableCell>
                <TableCell><b>Ciudad</b></TableCell>
                <TableCell align="center"><b>Acciones</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sedes.length > 0 ? (
                sedes.map((sede) => (
                  <TableRow
                    key={sede.idSede}
                    hover
                    sx={{
                      transition: "0.2s",
                      "&:hover": { backgroundColor: "#f0f0f0" },
                    }}
                  >
                    <TableCell>{sede.IdSede}</TableCell>
                    <TableCell>
                      <Typography>{sede.Nombre}</Typography>
                    </TableCell>
                    <TableCell>{sede.Dirección}</TableCell>
                    <TableCell>{sede.Teléfono}</TableCell>
                    <TableCell>{sede.nombreCiudad ?? sede.IdCiudad}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/sedes/ver/${sede.IdSede}`)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          color="success"
                          onClick={() => navigate(`/sedes/editar/${sede.IdSede}`)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => navigate(`/sedes/eliminar/${sede.IdSede}`)}
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
                    No hay sedes registradas.
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

export default ListaSedes;
