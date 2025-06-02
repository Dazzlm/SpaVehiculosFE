import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useForm, Controller } from "react-hook-form";

export default function AdministradorEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      Nombre: "",
      Apellidos: "",
      Email: "",
      Teléfono: "",
      Dirección: "",
      IdUsuario: "",
    },
  });

  useEffect(() => {
   const user = JSON.parse(localStorage.getItem("CurrentUser"));

fetch(`http://spavehiculos.runasp.net/api/GestorAdmin/ConsultarPorID?idAdmin=${id}`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user?.token}`,
  },
})
  .then(async (res) => {
    if (res.status === 204) throw new Error("Administrador no encontrado");
    if (!res.ok) throw new Error("Error al obtener administrador");
    const data = await res.json();
    reset(data);
    setLoading(false);
  })
  .catch(() => {
    setMensaje("Error al cargar datos.");
    setLoading(false);
  });

  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
     const user = JSON.parse(localStorage.getItem("CurrentUser"));

const res = await fetch("http://spavehiculos.runasp.net/api/GestorAdmin/ActualizarAdmin", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user?.token}`,
  },
  body: JSON.stringify(data),
});

if (!res.ok) throw new Error("Error en la actualización");
setMensaje("Administrador actualizado correctamente");
setTimeout(() => navigate("/usuarios/administradores"), 1500);
} catch {
  setMensaje("Error al actualizar administrador");
}

  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        p: 2,
        minHeight: "auto",
        backgroundColor: "transparent",
      }}
    >
     <Paper
  elevation={6}
  sx={{
    maxWidth: 450,
    width: "100%",
    p: 5,
    borderRadius: 4,
    bgcolor: "white",
    maxHeight: '60vh', 
    overflowY: 'auto',
  }}
>

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/usuarios/administradores")}
          sx={{
            mb: 4,
            color: "primary.main",
            borderColor: "primary.main",
            fontWeight: "bold",
            textTransform: "none",
            transition: "all 0.3s ease",
            "&:hover": {
              bgcolor: "primary.main",
              color: "white",
              borderColor: "primary.main",
            },
          }}
        >
          Volver
        </Button>

        <Typography
          variant="h4"
          fontWeight="bold"
          color="#1565c0"
          mb={4}
          align="center"
        >
          Editar Administrador
        </Typography>

        {mensaje && (
          <Alert
            severity={mensaje.includes("Error") ? "error" : "success"}
            sx={{ mb: 3, borderRadius: 2 }}
          >
            {mensaje}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box display="flex" flexDirection="column" gap={2}>
            <Controller
              name="IdAdmin"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ID Administrador"
                  disabled
                  fullWidth
                  size="large"
                />
              )}
            />
            <Controller
              name="Nombre"
              control={control}
              rules={{ required: "El nombre es obligatorio" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nombre"
                  error={!!errors.Nombre}
                  helperText={errors.Nombre?.message}
                  fullWidth
                  size="large"
                />
              )}
            />
            <Controller
              name="Apellidos"
              control={control}
              rules={{ required: "Los apellidos son obligatorios" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Apellidos"
                  error={!!errors.Apellidos}
                  helperText={errors.Apellidos?.message}
                  fullWidth
                  size="large"
                />
              )}
            />
            <Controller
              name="Email"
              control={control}
              rules={{
                required: "El email es obligatorio",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "Email no válido",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  error={!!errors.Email}
                  helperText={errors.Email?.message}
                  fullWidth
                  size="large"
                />
              )}
            />
            <Controller
              name="Teléfono"
              control={control}
              rules={{ required: "El teléfono es obligatorio" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Teléfono"
                  error={!!errors.Teléfono}
                  helperText={errors.Teléfono?.message}
                  fullWidth
                  size="large"
                />
              )}
            />
            <Controller
              name="FechaNacimiento"
              control={control}
              rules={{ required: "La fecha de nacimiento es obligatoria" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Fecha de Nacimiento"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.FechaNacimiento}
                  helperText={errors.FechaNacimiento?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="Cargo"
              control={control}
              rules={{ required: "El cargo es obligatorio" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Cargo"
                  error={!!errors.Cargo}
                  helperText={errors.Cargo?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="IdUsuario"
              control={control}
              rules={{
                required: "El ID Usuario es obligatorio",
                pattern: {
                  value: /^[1-9]\d*$/,
                  message: "Debe ser un número entero positivo",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ID Usuario"
                  type="number"
                  error={!!errors.IdUsuario}
                  helperText={errors.IdUsuario?.message}
                  fullWidth
                  size="large"
                />
              )}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<SaveIcon />}
              disabled={isSubmitting}
              sx={{
                mt: 2,
                fontWeight: "bold",
                py: 1.5,
                borderRadius: 3,
              }}
            >
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
