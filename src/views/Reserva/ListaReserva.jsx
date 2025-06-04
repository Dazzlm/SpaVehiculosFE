import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Button,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  TextField,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import 'dayjs/locale/es'; 
import Swal from 'sweetalert2';
import { eliminarReserva } from "../../helpers/Reservas/DeleteReservas";

import{obtenerTodasLasReservas,
  obtenerClientes,
  obtenerServicios,
  obtenerSedes
} from "../../helpers/Reservas/VisualizarHelper";

const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 500 },
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const ListaReservas = () => {
  const [allReservas, setAllReservas] = useState([]);
  const [filteredReservas, setFilteredReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState(null);

  const navigate = useNavigate();

  const handleEliminarReserva = async (id) => {
    const resultado = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!resultado.isConfirmed) return;

    try {
     
      const response = await eliminarReserva(id);

      setAllReservas((prevReservas) => prevReservas.filter((reserva) => reserva.IdReserva !== id));
      
      Swal.fire({
        icon: "success",
        title: "Eliminada",
        text: response.Message || "La reserva fue eliminada correctamente", 
        confirmButtonColor: "#3085d6",
      });
    } catch (err) {
      console.error("Error al eliminar reserva:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Hubo un problema al eliminar la reserva", 
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleOpenModal = (reserva) => {
    setSelectedReserva(reserva);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedReserva(null);
  };

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          reservasData,
          clientesData,
          serviciosData,
          sedesData,
        ] = await Promise.all([
          obtenerTodasLasReservas(),
          obtenerClientes(),
          obtenerServicios(),
          obtenerSedes(),
        ]);

        const clientesMap = new Map(
          clientesData.map((cliente) => [
            cliente.IdCliente,
            `${cliente.Nombre} ${cliente.Apellidos || ""}`.trim(),
          ])
        );
        const serviciosMap = new Map(
          serviciosData.map((servicio) => [servicio.IdServicio, servicio.Nombre])
        );
        const sedesMap = new Map(
          sedesData.map((sede) => [sede.IdSede, sede.Nombre])
        );

        const reservasConNombres = reservasData.map((reserva) => {
          return {
            ...reserva,
            NombreCliente: clientesMap.get(reserva.IdCliente) || "N/A",
            NombreServicio: serviciosMap.get(reserva.IdServicio) || "N/A",
            NombreSede: sedesMap.get(reserva.IdSede) || "N/A",
          };
        });

        setAllReservas(reservasConNombres);
        setFilteredReservas(reservasConNombres);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError(
          "No se pudieron cargar los datos necesarios. Por favor, intente de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    cargarDatosIniciales();
  }, []);

  useEffect(() => {
    const aplicarFiltros = () => {
      let tempReservas = [...allReservas];

      if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        tempReservas = tempReservas.filter(
          (reserva) =>
            String(reserva.IdReserva).toLowerCase().includes(lowerCaseSearchTerm) ||
            reserva.NombreCliente.toLowerCase().includes(lowerCaseSearchTerm) ||
            reserva.NombreServicio.toLowerCase().includes(lowerCaseSearchTerm) ||
            reserva.NombreSede.toLowerCase().includes(lowerCaseSearchTerm)
        );
      }

      if (filterDate) {
        const fechaAFiltrar = dayjs(filterDate).format("YYYY-MM-DD");
        tempReservas = tempReservas.filter((reserva) => {
          const fechaReserva = dayjs(reserva.Fecha).format("YYYY-MM-DD");
          return fechaReserva === fechaAFiltrar;
        });
      }

      setFilteredReservas(tempReservas);
    };

    aplicarFiltros();
  }, [searchTerm, filterDate, allReservas]);

  if (loading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", mt: 5, py: 3, px: 3 }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Cargando reservas...
        </Typography>
      </Box>
    );
  }

  if (error) {
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
        <Alert severity="error" sx={{ mt: 3, mx: "auto" }}>
          {error}
        </Alert>
      </Box>
    );
  }

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
        <Stack direction="row" alignItems="center" spacing={1}>
          <EventAvailableIcon sx={{ fontSize: 36, color: "#444" }} />
          <Typography variant="h5" fontWeight="bold">
            Lista de Reservas
          </Typography>
        </Stack>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/reservas/crear")}
        >
          Crear Reserva
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" mb={1}>
        <TextField
          label="Buscar por ID, Cliente, Servicio, Sede"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          sx={{ flexGrow: 1 }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <DatePicker
            label="Filtrar por Fecha"
            value={filterDate}
            onChange={(newValue) => setFilterDate(newValue)}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </LocalizationProvider>
        {(searchTerm || filterDate) && (
          <Button
            variant="outlined"
            onClick={() => {
              setSearchTerm("");
              setFilterDate(null);
            }}
          >
            Limpiar Filtros
          </Button>
        )}
      </Stack>

      <Box sx={{ overflowX: "auto" }}>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            minWidth: 800,
            maxHeight: 640,
            overflowY: "auto",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>
                  <b>ID Reserva</b>
                </TableCell>
                <TableCell>
                  <b>Cliente</b>
                </TableCell>
                <TableCell>
                  <b>Servicio</b>
                </TableCell>
                <TableCell>
                  <b>Sede</b>
                </TableCell>
                <TableCell>
                  <b>Fecha</b>
                </TableCell>
                <TableCell>
                  <b>Hora Inicio</b>
                </TableCell>
                <TableCell>
                  <b>Hora Fin</b>
                </TableCell>
                <TableCell align="center">
                  <b>Acciones</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReservas.length > 0 ? (
                filteredReservas.map((reserva) => (
                  <TableRow
                    key={reserva.IdReserva}
                    hover
                    sx={{
                      transition: "0.2s",
                      "&:hover": { backgroundColor: "#f0f0f0" },
                    }}
                  >
                    <TableCell>{reserva.IdReserva}</TableCell>
                    <TableCell>{reserva.NombreCliente}</TableCell>
                    <TableCell>{reserva.NombreServicio}</TableCell>
                    <TableCell>{reserva.NombreSede}</TableCell>
                    <TableCell>
                      {dayjs(reserva.Fecha).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell>{reserva.HoraInicio}</TableCell>
                    <TableCell>{reserva.HoraFin}</TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenModal(reserva)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          color="success"
                          onClick={() => navigate(`/reservas/actualizar/${reserva.IdReserva}`)}
                        >
                          <EditIcon/>
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleEliminarReserva(reserva.IdReserva)} 
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    align="center"
                    sx={{ py: 4, color: "gray" }}
                  >
                    No hay reservas que coincidan con los filtros aplicados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openModal}>
          <Box sx={styleModal}>
            <Typography id="transition-modal-title" variant="h6" component="h2" mb={2}>
              Detalles de la Reserva
            </Typography>
            {selectedReserva && (
              <Stack spacing={1}>
                <Typography>
                  <b>ID Reserva:</b> {selectedReserva.IdReserva}
                </Typography>
                <Typography>
                  <b>Cliente:</b> {selectedReserva.NombreCliente}
                </Typography>
                <Typography>
                  <b>Servicio:</b> {selectedReserva.NombreServicio}
                </Typography>
                <Typography>
                  <b>Sede:</b> {selectedReserva.NombreSede}
                </Typography>
                <Typography>
                  <b>Fecha:</b> {dayjs(selectedReserva.Fecha).format("DD/MM/YYYY")}
                </Typography>
                <Typography>
                  <b>Hora Inicio:</b> {selectedReserva.HoraInicio}
                </Typography>
                <Typography>
                  <b>Hora Fin:</b> {selectedReserva.HoraFin}
                </Typography>
              </Stack>
            )}
            <Button
              variant="contained"
              onClick={handleCloseModal}
              sx={{ mt: 3 }}
            >
              Cerrar
            </Button>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default ListaReservas;