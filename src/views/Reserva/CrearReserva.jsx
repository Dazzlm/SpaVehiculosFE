import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Box,
  TextField,
  MenuItem,
  Button,
  Stack,
  Alert, 
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import dayjs from "dayjs"; 
import swal from "sweetalert2"; 

const CrearReserva = () => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      IdCliente: "",
      IdServicio: "",
      IdSede: "",
      Fecha: dayjs().format("YYYY-MM-DD"),
      HoraInicio: "09:00", 
    },
  });

  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [apiError, setApiError] = useState(null); 

  const navigate = useNavigate();
  const API_BASE = "http://spavehiculos.runasp.net/api";
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setApiError(null);
        const [clientesRes, serviciosRes, sedesRes] = await Promise.all([
          axios.get(`${API_BASE}/Clientes/ConsultarTodos`),
          axios.get(`${API_BASE}/Servicios/ConsultarTodos`),
          axios.get(`${API_BASE}/Sedes/ConsultarTodos`),
        ]);

        setClientes(clientesRes.data);
        setServicios(serviciosRes.data);
        setSedes(sedesRes.data);
      } catch (error) {
        console.error("Error cargando datos iniciales:", error);
        setApiError(
          "No se pudieron cargar los datos iniciales. Por favor, intente de nuevo más tarde."
        );
      }
    };

    cargarDatos();
  }, []);

  const onSubmit = async (data) => {
  setApiError(null); 
  try {
    const fechaFormateada = dayjs(data.Fecha).format("YYYY-MM-DD");
    const body = {
      IdCliente: parseInt(data.IdCliente),
      IdServicio: parseInt(data.IdServicio),
      IdSede: parseInt(data.IdSede),
      Fecha: `${fechaFormateada}T00:00:00`,
      HoraInicio: `${data.HoraInicio}:00`,
    };

    const response = await axios.post(`${API_BASE}/Reservas/CrearReserva`, body);

    if (response.data && typeof response.data === "object" && response.data.Message) {
      if (response.data.Message === "Reserva creada con éxito") {
        swal.fire({
          icon: "success",
            title: "Reserva creada",
            text: "La reserva se ha creado correctamente.",
            confirmButtonColor: "#3085d6",
        });
        navigate("/reservas");
      } else {
        setApiError(response.data.Message);
      }
    } else if (typeof response.data === "string") {
      if (response.data === "Reserva creada con éxito") {
        navigate("/reservas");
      } else {
        setApiError(response.data);
      }
    } else {
      setApiError("Formato de respuesta de éxito inesperado del servidor.");
    }

  } catch (error) {
    console.error("Error al crear reserva:", error);
    let errorMessage = "Error desconocido al crear la reserva.";

    if (error.response && error.response.data) {
      if (typeof error.response.data === "string") {
        errorMessage = error.response.data;
      } else if (typeof error.response.data === "object") {
        errorMessage =
          error.response.data.message ||
          error.response.data.error ||
          error.response.data.title ||
          error.response.data.detail ||
          (error.response.data.Message || JSON.stringify(error.response.data)); 
      }
    } else if (error.request) {
      errorMessage =
        "No se recibió respuesta del servidor. Verifique su conexión de red";
    } else {
      errorMessage = "Error al configurar la solicitud.";
    }
    setApiError(`Error al crear la reserva: ${errorMessage}`);
  }
};

  return (
    <Paper
      sx={{
        p: 5,
        maxWidth: 600,
        margin: "auto",
        mt: 6,
        boxShadow: 4,
        borderRadius: 3,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={4} textAlign="center">
        Crear Reserva
      </Typography>

      {apiError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {apiError}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
        display="flex"
        flexDirection="column"
        gap={3}
      >
        <Controller
          name="IdCliente"
          control={control}
          rules={{ required: "El cliente es obligatorio" }}
          render={({ field }) => (
            <TextField
              select
              label="Cliente"
              {...field}
              fullWidth
              error={!!errors.IdCliente}
              helperText={errors.IdCliente?.message}
            >
              <MenuItem value="">
                <em>Seleccione un cliente</em>
              </MenuItem>
              {clientes.map((c) => (
                <MenuItem key={c.IdCliente} value={c.IdCliente}>
                  {c.Nombre}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="IdServicio"
          control={control}
          rules={{ required: "El servicio es obligatorio" }}
          render={({ field }) => (
            <TextField
              select
              label="Servicio"
              {...field}
              fullWidth
              error={!!errors.IdServicio}
              helperText={errors.IdServicio?.message}
            >
              <MenuItem value="">
                <em>Seleccione un servicio</em>
              </MenuItem>
              {servicios.map((s) => (
                <MenuItem key={s.IdServicio} value={s.IdServicio}>
                  {s.Nombre}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="IdSede"
          control={control}
          rules={{ required: "La sede es obligatoria" }}
          render={({ field }) => (
            <TextField
              select
              label="Sede"
              {...field}
              fullWidth
              error={!!errors.IdSede}
              helperText={errors.IdSede?.message}
            >
              <MenuItem value="">
                <em>Seleccione una sede</em>
              </MenuItem>
              {sedes.map((s) => (
                <MenuItem key={s.IdSede} value={s.IdSede}>
                  {s.Nombre}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        <TextField
          label="Fecha"
          type="date"
          {...register("Fecha", {
            required: "La fecha es obligatoria",
            validate: (value) => {
              const selectedDate = dayjs(value);
              const today = dayjs();
              if (selectedDate.isBefore(today, 'day')) {
                return "La fecha de la reserva no puede ser anterior al día actual.";
              }
              return true;
            },
          })}
          error={!!errors.Fecha}
          helperText={errors.Fecha?.message}
          fullWidth
        />

        <TextField
          label="Hora de inicio"
          type="time"
          {...register("HoraInicio", {
            required: "La hora de inicio es obligatoria",
          })}
          error={!!errors.HoraInicio}
          helperText={errors.HoraInicio?.message}
          fullWidth
        />

        <Stack direction="row" spacing={2} justifyContent="space-between" mt={3}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            color="secondary"
            onClick={() => navigate("/reservas")}
          >
            Regresar
          </Button>

          <Button variant="contained" type="submit" color="primary">
            Guardar Reserva
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default CrearReserva;