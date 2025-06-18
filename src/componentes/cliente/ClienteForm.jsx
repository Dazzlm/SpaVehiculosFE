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
    setValue,
    formState: { errors },
  } = useForm();

  const reglas = (nombreCampo, min, max, regex = null, mensajeRegex = "") => ({
    required: `El campo ${nombreCampo} es obligatorio`,
    minLength: {
      value: min,
      message: `Debe tener al menos ${min} caracteres`,
    },
    maxLength: {
      value: max,
      message: `No puede exceder los ${max} caracteres`,
    },
    validate: (value) => {
      const cleaned = value.trim();
      if (cleaned === "") return `El campo ${nombreCampo} no puede estar vacío`;
      if (/\s{2,}/.test(cleaned))
        return `No debe contener espacios consecutivos`;
      if (regex && !regex.test(cleaned)) return mensajeRegex;
      return true;
    },
  });

  const limpiarInput = (nombreCampo, tipo) => (e) => {
    let valor = e.target.value;
    if (
      tipo === "email" ||
      nombreCampo === "DocumentoUsuario" ||
      nombreCampo === "Telefono"
    ) {
      valor = valor.replace(/\s+/g, "");
    } else {
      valor = valor.replace(/\s+/g, " ").trimStart();
    }
    setValue(nombreCampo, valor, { shouldValidate: true });
  };

  const onSubmit = async (data) => {
    try {
      const storedUser = JSON.parse(
        localStorage.getItem("CurrentUser") || "null"
      );
      const token = storedUser?.token || null;

      if (!token) throw new Error("No se encontró el token de autenticación.");

      const response = await fetch(
        "https://spavehiculos.runasp.net/api/Clientes/InsertarClienteUsuario",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("Error al guardar el cliente");

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
        Registro de Cliente y Usuario
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
          fullWidth
          {...register("Nombre", reglas("Nombre", 2, 40))}
          onChange={limpiarInput("Nombre")}
          error={!!errors.Nombre}
          helperText={errors.Nombre?.message}
        />

        <TextField
          label="Apellidos"
          fullWidth
          {...register("Apellidos", reglas("Apellidos", 2, 50))}
          onChange={limpiarInput("Apellidos")}
          error={!!errors.Apellidos}
          helperText={errors.Apellidos?.message}
        />

        <TextField
          label="Email"
          fullWidth
          type="email"
          {...register(
            "Email",
            reglas("Email", 5, 60, /\S+@\S+\.\S+/, "El correo no es válido")
          )}
          onChange={limpiarInput("Email", "email")}
          error={!!errors.Email}
          helperText={errors.Email?.message}
        />

        <TextField
          label="Teléfono"
          fullWidth
          {...register(
            "Telefono",
            reglas("Teléfono", 7, 10, /^[0-9-]+$/, "Solo números o guiones")
          )}
          onChange={limpiarInput("Telefono")}
          error={!!errors.Telefono}
          helperText={errors.Telefono?.message}
        />

        <TextField
          label="Dirección"
          fullWidth
          {...register("Direccion", reglas("Dirección", 5, 100))}
          onChange={limpiarInput("Direccion")}
          error={!!errors.Direccion}
          helperText={errors.Direccion?.message}
        />

        <TextField
          label="Nombre de Usuario"
          fullWidth
          {...register("NombreUsuario", reglas("Nombre Usuario", 3, 20))}
          onChange={limpiarInput("NombreUsuario")}
          error={!!errors.NombreUsuario}
          helperText={errors.NombreUsuario?.message}
        />

        <TextField
          label="Documento"
          fullWidth
          {...register(
            "DocumentoUsuario",
            reglas("Documento", 5, 10, /^[0-9]+$/, "Solo debe contener números")
          )}
          onChange={limpiarInput("DocumentoUsuario", "documento")}
          error={!!errors.DocumentoUsuario}
          helperText={errors.DocumentoUsuario?.message}
        />

        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          mt={3}
        >
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
