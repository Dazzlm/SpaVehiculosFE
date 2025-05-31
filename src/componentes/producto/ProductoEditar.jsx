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

export default function ProductoEditar() {
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
      Descripción: "",
      Precio: "",
      IdProveedor: "",
    },
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("CurrentUser"));
    const token = storedUser?.token;

    if (!token) {
      console.warn("No se encontró token, redirigiendo al login...");
      navigate("/login");
      return;
    }

    fetch(`http://spavehiculos.runasp.net/api/Productos/ObtenerPorId?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (res.status === 204) throw new Error("Producto no encontrado");
        if (!res.ok) throw new Error("Error al obtener producto");
        const response = await res.json();

        const data = response.data;

        reset({
          Nombre: data.Nombre,
          Descripción: data.Descripción,
          Precio: data.Precio,
          IdProveedor: data.IdProveedor,
        });

        setLoading(false);
      })
      .catch(() => {
        setMensaje("Error al cargar datos.");
        setLoading(false);
      });
  }, [id, reset, navigate]);

  const onSubmit = async (data) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("CurrentUser"));
      const token = storedUser?.token;

      if (!token) {
        setMensaje("No autorizado. Por favor inicia sesión.");
        navigate("/login");
        return;
      }

      data.IdProducto = id;

      const res = await fetch(
        "http://spavehiculos.runasp.net/api/Productos/Actualizar",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error("Error en la actualización");
      setMensaje("Producto actualizado correctamente");
      setTimeout(() => navigate("/productos"), 1500);
    } catch {
      setMensaje("Error al actualizar producto");
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
          onClick={() => navigate("/gestion/productos")}
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
          Editar Producto
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
                  size="medium"
                />
              )}
            />

            <Controller
              name="Descripción"
              control={control}
              rules={{ required: "La descripción es obligatoria" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Descripción"
                  error={!!errors.Descripción}
                  helperText={errors.Descripción?.message}
                  fullWidth
                  multiline
                  rows={3}
                  size="medium"
                />
              )}
            />

            <Controller
              name="Precio"
              control={control}
              rules={{
                required: "El precio es obligatorio",
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: "Ingresa un precio válido",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Precio"
                  error={!!errors.Precio}
                  helperText={errors.Precio?.message}
                  fullWidth
                  size="medium"
                  type="number"
                  inputProps={{ step: "0.01", min: "0" }}
                />
              )}
            />

            <Controller
              name="IdProveedor"
              control={control}
              rules={{ required: "El ID de proveedor es obligatorio" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ID Proveedor"
                  error={!!errors.IdProveedor}
                  helperText={errors.IdProveedor?.message}
                  fullWidth
                  size="medium"
                  type="number"
                  inputProps={{ min: "1" }}
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
