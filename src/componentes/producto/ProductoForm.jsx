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

export default function ProductoForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    data.Precio = parseFloat(data.Precio);

    try {
      const storedUser = JSON.parse(localStorage.getItem('CurrentUser') || 'null');
      const token = storedUser?.token || (typeof currentUser !== 'undefined' ? currentUser?.token : null);

      if (!token) {
        throw new Error("No se encontró el token de autenticación.");
      }

      const response = await fetch(
        "http://spavehiculos.runasp.net/api/Productos/Crear",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,  
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Error al guardar el producto");
      }

      navigate("/productos");
    } catch (error) {
      console.error("Error en la solicitud:", error.message);
    }
  };

  return (
    <Paper
      sx={{
        p: 5,
        maxWidth: 700,
        margin: "auto",
        mt: 6,
        boxShadow: 4,
        borderRadius: 3,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={4} textAlign="center">
        Formulario de Producto
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
          label="Descripción"
          {...register("Descripción", { required: "La descripción es obligatoria" })}
          error={!!errors.Descripción}
          helperText={errors.Descripción?.message}
          fullWidth
        />

        <TextField
          label="Precio"
          type="number"
          {...register("Precio", {
            required: "El precio es obligatorio",
            min: { value: 0, message: "El precio debe ser positivo" },
          })}
          error={!!errors.Precio}
          helperText={errors.Precio?.message}
          fullWidth
        />

        <TextField
          label="Id Proveedor"
          type="number"
          {...register("IdProveedor", {
            required: "El id del proveedor es obligatorio",
            min: { value: 1, message: "Debe ser un id válido" },
          })}
          error={!!errors.IdProveedor}
          helperText={errors.IdProveedor?.message}
          fullWidth
        />

        <Stack direction="row" spacing={2} justifyContent="space-between" mt={3}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            color="secondary"
            onClick={() => navigate("/gestion/productos")}
          >
            Regresar
          </Button>

          <Button variant="contained" type="submit" color="primary">
            Guardar Producto
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
