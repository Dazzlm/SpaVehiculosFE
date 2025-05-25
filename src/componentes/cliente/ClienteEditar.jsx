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

export default function ClienteEditar() {
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
    fetch(`https://localhost:44376/api/Clientes/ConsultarXId?idCliente=${id}`)
      .then(async (res) => {
        if (res.status === 204) throw new Error("Cliente no encontrado");
        if (!res.ok) throw new Error("Error al obtener cliente");
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
      const res = await fetch("https://localhost:44376/api/Clientes/Actualizar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Error en la actualización");
      setMensaje("Cliente actualizado correctamente");
      setTimeout(() => navigate("/usuarios/cliente"), 1500);
    } catch {
      setMensaje("Error al actualizar cliente");
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
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/usuarios/cliente")}
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
          Editar Cliente
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
          <Box display="flex" flexDirection="column" gap={3}>
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
                  value:
                    /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
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
              name="Dirección"
              control={control}
              rules={{ required: "La dirección es obligatoria" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Dirección"
                  error={!!errors.Dirección}
                  helperText={errors.Dirección?.message}
                  fullWidth
                  size="large"
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
