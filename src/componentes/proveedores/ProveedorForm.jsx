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

export default function ProveedorForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
    const user = JSON.parse(localStorage.getItem("CurrentUser"));

const response = await fetch(
  "https://spavehiculos.runasp.net/api/GestorProv/CrearProveedor",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user?.token}`,
    },
    body: JSON.stringify(data),
  }
);


      if (!response.ok) {
        throw new Error("Error al guardar el proveedor");
      }

      navigate("/usuarios/proveedor");
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
        Formulario Proveedor
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
          label="Nombre de la Empresa"
          {...register("NombreEmpresa", { required: "El nombre es obligatorio" })}
          error={!!errors.NombreEmpresa}
          helperText={errors.NombreEmpresa?.message}
          fullWidth
        />
        <TextField
          label="Contacto"
          {...register("Contacto", { required: "El contacto es obligatorio" })}
          error={!!errors.Contacto}
          helperText={errors.Contacto?.message}
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
          label="Email"
          type="email"
          {...register("Email", {
            required: "El email es obligatorio",
            pattern: {
              value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
              message: "Email no es válido",
            },
          })}
          error={!!errors.Email}
          helperText={errors.Email?.message}
          fullWidth
        />

        <Stack direction="row" spacing={2} justifyContent="space-between" mt={3}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            color="secondary"
            onClick={() => navigate("/usuarios/proveedor")}
          >
            Regresar
          </Button>

          <Button variant="contained" type="submit" color="primary">
            Guardar Proveedor
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
