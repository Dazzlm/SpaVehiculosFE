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

export default function CiudadEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      Nombre: "",
      Departamento: "",
      CódigoPostal: "",
    },
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("CurrentUser"));
    const token = storedUser?.token;

    if (!token) {
      navigate("/login");
      return;
    }

    fetch(
      `https://spavehiculos.runasp.net/api/Ciudades/ConsultarXId?idCiudad=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(async (res) => {
        if (res.status === 204) throw new Error("Ciudad no encontrada");
        if (!res.ok) throw new Error("Error al obtener ciudad");
        const data = await res.json();
        reset(data.Data);
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

      const res = await fetch(
        "https://spavehiculos.runasp.net/api/Ciudades/Actualizar",
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
      setMensaje("Ciudad actualizada correctamente");
      setTimeout(() => navigate("/ciudades"), 1500);
    } catch {
      setMensaje("Error al actualizar ciudad");
    }
  };

  const handleInputChange = (name, value) => {
    const cleaned = value.replace(/\s+/g, " ");
    setValue(name, cleaned, { shouldValidate: true });
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
          backgroundColor: "transparent",
          minWidth: "20vw",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 450,
          width: "100%",
          p: 5,
          borderRadius: 4,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/ciudades")}
          sx={{
            mb: 4,
            color: "primary.main",
            borderColor: "primary.main",
            fontWeight: "bold",
            textTransform: "none",
            "&:hover": {
              bgcolor: "primary.main",
              color: "white",
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
          Editar Ciudad
        </Typography>

        {mensaje && (
          <Alert
            severity={mensaje.includes("Error") ? "error" : "success"}
            sx={{ mb: 3 }}
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
                minLength: {
                  value: 2,
                  message: "Debe tener al menos 2 caracteres",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nombre"
                  onChange={(e) => handleInputChange("Nombre", e.target.value)}
                  error={!!errors.Nombre}
                  helperText={errors.Nombre?.message}
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
              sx={{ mt: 2, fontWeight: "bold", py: 1.5, borderRadius: 3 }}
            >
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
