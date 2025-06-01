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

export default function SedeEditar() {
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
      Dirección: "",
      IdCiudad: "",
      Teléfono: "",
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

    fetch(`http://spavehiculos.runasp.net/api/Sedes/ConsultarXId?idSede=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (res.status === 204) throw new Error("Sede no encontrada");
        if (!res.ok) throw new Error("Error al obtener sede");
        const data = await res.json();
        reset(data);
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

      const res = await fetch("http://spavehiculos.runasp.net/api/Sedes/Actualizar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Error en la actualización");
      setMensaje("Sede actualizada correctamente");
      setTimeout(() => navigate("/sedes"), 1500);
    } catch {
      setMensaje("Error al actualizar sede");
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
          onClick={() => navigate("/sedes")}
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
          Editar Sede
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
                />
              )}
            />
            <Controller
              name="IdCiudad"
              control={control}
              rules={{ required: "El ID de ciudad es obligatorio" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ID Ciudad"
                  error={!!errors.IdCiudad}
                  helperText={errors.IdCiudad?.message}
                  fullWidth
                  type="number"
                  inputProps={{ min: "1" }}
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
