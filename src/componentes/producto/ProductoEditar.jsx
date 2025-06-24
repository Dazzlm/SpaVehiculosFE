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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useForm, Controller } from "react-hook-form";

export default function ProductoEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [proveedores, setProveedores] = useState([]);

  const limpiarEspacios = (value) => value.replace(/\s+/g, " ").trimStart();

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
    const fetchProveedores = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("CurrentUser"));
        const token = storedUser?.token;

        if (!token)
          throw new Error("No se encontró el token de autenticación.");

        const res = await fetch(
          "https://spavehiculos.runasp.net/api/GestorProv/ConsultarTodos",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Error al obtener proveedores");

        const data = await res.json();
        setProveedores(data.Data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProveedores();
  }, []);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("CurrentUser"));
        const token = storedUser?.token;

        if (!token) {
          console.warn("No se encontró token, redirigiendo al login...");
          navigate("/login");
          return;
        }

        const res = await fetch(
          `https://spavehiculos.runasp.net/api/Productos/ObtenerPorId?id=${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status === 204) throw new Error("Producto no encontrado");
        if (!res.ok) throw new Error("Error al obtener producto");

        const response = await res.json();
        const data = response.Data;

        reset({
          Nombre: data.Nombre,
          Descripción: data.Descripción,
          Precio: data.Precio,
          IdProveedor: data.IdProveedor,
        });

        setLoading(false);
      } catch {
        setMensaje("Error al cargar datos.");
        setLoading(false);
      }
    };

    fetchProducto();
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
        "https://spavehiculos.runasp.net/api/Productos/Actualizar",
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
      setTimeout(() => navigate("/gestion/productos"), 1500);
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
              rules={{
                required: "El nombre es obligatorio",
                minLength: { value: 2, message: "Mínimo 2 caracteres" },
                maxLength: { value: 50, message: "Máximo 50 caracteres" },
                validate: (value) =>
                  limpiarEspacios(value).length > 0 ||
                  "El nombre no puede estar vacío",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  onChange={(e) =>
                    field.onChange(limpiarEspacios(e.target.value))
                  }
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
              rules={{
                required: "La descripción es obligatoria",
                minLength: { value: 5, message: "Mínimo 5 caracteres" },
                maxLength: { value: 250, message: "Máximo 250 caracteres" },
                validate: (value) =>
                  limpiarEspacios(value).length > 0 ||
                  "La descripción no puede estar vacía",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  onChange={(e) =>
                    field.onChange(limpiarEspacios(e.target.value))
                  }
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
                  message: "Formato inválido (máximo 2 decimales)",
                },
                min: {
                  value: 0.01,
                  message: "Debe ser mayor a 0",
                },
                max: {
                  value: 9999999.99,
                  message: "Precio demasiado alto",
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
                  inputProps={{ step: "0.01", min: "0.01", max: "9999999.99" }}
                />
              )}
            />

            <FormControl fullWidth error={!!errors.IdProveedor}>
              <InputLabel id="proveedor-label">Proveedor</InputLabel>
              <Controller
                name="IdProveedor"
                control={control}
                rules={{ required: "El proveedor es obligatorio" }}
                render={({ field }) => (
                  <Select
                    labelId="proveedor-label"
                    label="Proveedor"
                    {...field}
                  >
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
