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
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dayjs from "dayjs";
import swal from "sweetalert2";
import {
  actualizarReserva,
  consultarReservaPorId,
  consultarClientes,
  consultarServicios,
  consultarSedes,
} from "../../helpers/Reservas/ActualizarReserva"; 

const ActualizarReserva = () => {
  const { idReserva } = useParams();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    register,
    reset,
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarDatosYReserva = async () => {
      const numericIdReserva = parseInt(idReserva);
      if (isNaN(numericIdReserva)) {
        console.error("ID de reserva inválido en la URL:", idReserva);
        setApiError("ID de reserva inválido. Por favor, asegúrese de que la URL sea correcta.");
        setLoading(false);
        return;
      }

      try {
        setApiError(null);
        setLoading(true);

        console.log("useEffect: ID de reserva de useParams:", idReserva, "Tipo:", typeof idReserva, "Parseado:", numericIdReserva);


        const [clientesRes, serviciosRes, sedesRes] = await Promise.all([
          consultarClientes(),
          consultarServicios(),
          consultarSedes(),
        ]);

        setClientes(clientesRes);
        setServicios(serviciosRes);
        setSedes(sedesRes);

        const reservaData = await consultarReservaPorId(numericIdReserva);
        const fechaFormateada = dayjs(reservaData.Fecha).format("YYYY-MM-DD");
        const horaInicioFormateada = dayjs(reservaData.HoraInicio, "HH:mm:ss.SSSSSSS").format("HH:mm");

        reset({
          IdReserva: reservaData.IdReserva,
          IdCliente: reservaData.IdCliente,
          IdServicio: reservaData.IdServicio,
          IdSede: reservaData.IdSede,
          Fecha: fechaFormateada,
          HoraInicio: horaInicioFormateada,
        });
      } catch (error) {
        console.error("Error cargando datos o reserva:", error);
        setApiError(
          "No se pudieron cargar los datos o la reserva. Por favor, intente de nuevo más tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    cargarDatosYReserva();
  }, [idReserva, reset, navigate]); 

  const onSubmit = async (data) => {
    setApiError(null);
    try {
      const fechaHoraInicioCompleta = dayjs(`${data.Fecha}T${data.HoraInicio}`);
      const fechaFormateadaBackend = fechaHoraInicioCompleta.toISOString();

      const body = {
        IdReserva: parseInt(idReserva),
        IdCliente: parseInt(data.IdCliente),
        IdServicio: parseInt(data.IdServicio),
        IdSede: parseInt(data.IdSede),
        Fecha: fechaFormateadaBackend,
        HoraInicio: `${data.HoraInicio}:00`, 
      };

      console.log("PAYLOAD FINAL ENVIADO AL BACKEND:", body);

      const response = await actualizarReserva(body);

      if (response && response.Message === "Reserva actualizada con éxito") {
        swal.fire({
          icon: "success",
          title: "Reserva actualizada",
          text: "La reserva se ha actualizado correctamente.",
          confirmButtonColor: "#3085d6",
        });
        navigate("/reservas");
      } else if (response && response.Message) {
        setApiError(response.Message);
      } else {
        setApiError("Formato de respuesta de éxito inesperado del servidor.");
      }
    } catch (error) {
      console.error("Error al actualizar reserva:", error);
      let errorMessage = "Error desconocido al actualizar la reserva.";

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
      setApiError(`Error al actualizar la reserva: ${errorMessage}`);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Cargando reserva...</Typography>
      </Box>
    );
  }

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
        Actualizar Reserva
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
              if (selectedDate.isBefore(today, "day")) {
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
            Actualizar Reserva
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default ActualizarReserva;