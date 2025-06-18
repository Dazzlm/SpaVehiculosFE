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
      Telefono: "",
      Direccion: "",
      DocumentoUsuario: "",
      NombreUsuario: "",
    },
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("CurrentUser"));
    const token = storedUser?.token;

    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`https://spavehiculos.runasp.net/api/Clientes/ConsultarClienteUsuario?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (res.status === 204) throw new Error("Cliente no encontrado");
        if (!res.ok) throw new Error("Error al obtener cliente");
        const data = await res.json();
        reset(data.Data);
        setLoading(false);
      })
      .catch(() => {
        setMensaje("Error al cargar datos.");
        setLoading(false);
      });
  }, [id, navigate, reset]);

  const onSubmit = async (data) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("CurrentUser"));
      const token = storedUser?.token;

      if (!token) {
        navigate("/login");
        return;
      }

      const datosActualizados = {
        ...data,
        IdCliente: parseInt(id),
      };

      const res = await fetch(
        "https://spavehiculos.runasp.net/api/Clientes/ActualizarClienteUsuario",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(datosActualizados),
        }
      );

      const mensajeRespuesta = await res.text();

      if (!res.ok) throw new Error(mensajeRespuesta);

      setMensaje(mensajeRespuesta);
      setTimeout(() => navigate("/usuarios/cliente"), 1500);
    } catch (error) {
      setMensaje(error.message || "Error al actualizar cliente");
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );

  return (
    <Box display="flex" justifyContent="center" p={2}>
      <Paper elevation={6} sx={{ maxWidth: 400, width: "100%", p: 3, borderRadius: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/usuarios/cliente")}
          sx={{
            mb: 3,
            fontWeight: "bold",
            borderColor: "primary.main",
            color: "primary.main",
            "&:hover": {
              bgcolor: "primary.main",
              color: "white",
            },
          }}
        >
          Volver
        </Button>

        <Typography variant="h4" fontWeight="bold" color="primary" mb={3} align="center">
          Editar Cliente
        </Typography>

        {mensaje && (
          <Alert
            severity={mensaje.includes("Error") || mensaje.includes("error") ? "error" : "success"}
            sx={{ mb: 2, borderRadius: 2 }}
          >
            {mensaje}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box display="flex" flexDirection="column" gap={3}>
            <Controller
              name="Nombre"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Nombre" fullWidth size="large" />
              )}
            />
            <Controller
              name="Apellidos"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Apellidos" fullWidth size="large" />
              )}
            />
            <Controller
              name="Email"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Email" type="email" fullWidth size="large" />
              )}
            />
            <Controller
              name="Telefono"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Teléfono" fullWidth size="large" />
              )}
            />
            <Controller
              name="Direccion"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Dirección" fullWidth size="large" />
              )}
            />
            <Controller
              name="DocumentoUsuario"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Documento Usuario" fullWidth size="large" />
              )}
            />
            <Controller
              name="NombreUsuario"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Nombre Usuario" fullWidth size="large" />
              )}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              startIcon={<SaveIcon />}
              disabled={isSubmitting}
              sx={{ mt: 2, fontWeight: "bold", borderRadius: 3 }}
            >
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
