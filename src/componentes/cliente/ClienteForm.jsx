import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ClienteForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await fetch(
        "https://localhost:44376/api/Clientes/Insertar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Error al guardar el cliente");
      }

      navigate("/usuarios/cliente");
    } catch (error) {
      console.error("Error en la solicitud:", error.message);
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
        Formulario Cliente
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        autoComplete="off"
        display="flex"
        flexDirection="column"
        gap={3}
      >
        <TextField
          label="Nombre"
          {...register("Nombre", { required: "El nombre es obligatorio" })}
          error={!!errors.Nombre}
          helperText={errors.Nombre?.message}
          fullWidth
        />
        <TextField
          label="Apellidos"
          {...register("Apellidos", { required: "Los apellidos son obligatorios" })}
          error={!!errors.Apellidos}
          helperText={errors.Apellidos?.message}
          fullWidth
        />
        <TextField
          label="Email"
          type="email"
          {...register("Email", {
            required: "El email es obligatorio",
            pattern: {
              value:
                /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
              message: "Email no es válido",
            },
          })}
          error={!!errors.Email}
          helperText={errors.Email?.message}
          fullWidth
        />
        <TextField
          label="Teléfono"
          {...register("Teléfono", { required: "El teléfono es obligatorio" })}
          error={!!errors.Teléfono}
          helperText={errors.Teléfono?.message}
          fullWidth
        />
        <TextField
          label="Dirección"
          {...register("Dirección", { required: "La dirección es obligatoria" })}
          error={!!errors.Dirección}
          helperText={errors.Dirección?.message}
          fullWidth
        />
        <TextField
          label="Id Usuario"
          type="number"
          {...register("IdUsuario", {
            required: "El IdUsuario es obligatorio",
            valueAsNumber: true,
            validate: (value) =>
              value > 0 || "El IdUsuario debe ser mayor que 0",
          })}
          error={!!errors.IdUsuario}
          helperText={errors.IdUsuario?.message}
          fullWidth
        />

        <Stack direction="row" spacing={2} justifyContent="space-between" mt={3}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            color="secondary"
            onClick={() => navigate("/usuarios/cliente")}
          >
            Regresar
          </Button>

          <Button variant="contained" type="submit" color="primary">
            Guardar Cliente
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
