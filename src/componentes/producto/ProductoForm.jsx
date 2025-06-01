import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ProductoForm() {
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  useEffect(() => {
  const fetchProveedores = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("CurrentUser") || "null");
      const token = storedUser?.token;

      if (!token) {
        throw new Error("No se encontró el token de autenticación.");
      }

      const response = await fetch("http://spavehiculos.runasp.net/api/GestorProv/ConsultarTodos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener proveedores");
      }

      const data = await response.json();
      setProveedores(data);
    } catch (error) {
      console.error("Error al obtener proveedores:", error.message);
    }
  };
  fetchProveedores();
}, []);


  const onSubmit = async (data) => {
    data.Precio = parseFloat(data.Precio);

    try {
      const storedUser = JSON.parse(localStorage.getItem("CurrentUser") || "null");
      const token = storedUser?.token;

      if (!token) {
        throw new Error("No se encontró el token de autenticación.");
      }

      const response = await fetch("http://spavehiculos.runasp.net/api/Productos/Crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

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

        <FormControl fullWidth error={!!errors.IdProveedor}>
          <InputLabel id="proveedor-label">Proveedor</InputLabel>
          <Controller
            name="IdProveedor"
            control={control}
            defaultValue=""
            rules={{ required: "El proveedor es obligatorio" }}
            render={({ field }) => (
              <Select labelId="proveedor-label" label="Proveedor" {...field}>
                {proveedores.map((prov) => (
                  <MenuItem key={prov.IdProveedor} value={prov.IdProveedor}>
                    {prov.NombreEmpresa}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <FormHelperText>{errors.IdProveedor?.message}</FormHelperText>
        </FormControl>

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
