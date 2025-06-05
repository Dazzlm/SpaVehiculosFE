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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useForm, Controller } from "react-hook-form";

export default function AdministradorEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      Nombre: "",
      Apellidos: "",
      Email: "",
      Telefono: "",
      Cedula: "",
      NombreUsuario: "",
      FechaNacimiento: "",
      Cargo: "",
      Estado: true,
    },
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("CurrentUser"));

    fetch(
      `https://spavehiculos.runasp.net/api/GestorAdmin/ConsultarAdminUsuario?id=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    )
      .then(async (res) => {
        if (res.status === 204) throw new Error("Administrador no encontrado");
        if (!res.ok) throw new Error("Error al obtener administrador");
        const data = await res.json();

        if (data.FechaNacimiento)
          data.FechaNacimiento = data.FechaNacimiento.split("T")[0];
        reset(data);
        setLoading(false);
      })
      .catch(() => {
        setMensaje("Error al cargar datos.");
        setLoading(false);
      });
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      const user = JSON.parse(localStorage.getItem("CurrentUser"));
      const valores = getValues();

      const payload = {
        ...data,
        IdAdmin: parseInt(id),
        Contrasena: valores.Contrasena ?? "",
      };

      const res = await fetch(
        "https://spavehiculos.runasp.net/api/GestorAdmin/ActualizarAdminUsuario",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Error en la actualización");
      setMensaje("Administrador actualizado correctamente");
      setTimeout(() => navigate("/usuarios/administradores"), 1500);
    } catch {
      setMensaje("Error al actualizar administrador");
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
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 500,
          width: "100%",
          p: 5,
          borderRadius: 4,
          bgcolor: "white",
          maxHeight: "65vh",
          overflowY: "auto",
        }}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/usuarios/administradores")}
          sx={{
            mb: 4,
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
          variant="h5"
          fontWeight="bold"
          color="primary"
          align="center"
          mb={3}
        >
          Editar Administrador
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
          <Box display="flex" flexDirection="column" gap={2}>
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
              name="Apellidos"
              control={control}
              rules={{ required: "Los apellidos son obligatorios" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Apellidos"
                  error={!!errors.Apellidos}
                  helperText={errors.Apellidos?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="Email"
              control={control}
              rules={{
                required: "El email es obligatorio",
                pattern: {
                  value:
                    /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "Email no válido",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  error={!!errors.Email}
                  helperText={errors.Email?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="Telefono"
              control={control}
              rules={{ required: "El teléfono es obligatorio" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Teléfono"
                  error={!!errors.Telefono}
                  helperText={errors.Telefono?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="Cedula"
              control={control}
              rules={{ required: "La cédula es obligatoria" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Cédula"
                  error={!!errors.Cedula}
                  helperText={errors.Cedula?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="NombreUsuario"
              control={control}
              rules={{ required: "El nombre de usuario es obligatorio" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nombre de Usuario"
                  error={!!errors.NombreUsuario}
                  helperText={errors.NombreUsuario?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="FechaNacimiento"
              control={control}
              rules={{ required: "La fecha de nacimiento es obligatoria" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Fecha de Nacimiento"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.FechaNacimiento}
                  helperText={errors.FechaNacimiento?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="Cargo"
              control={control}
              rules={{ required: "El cargo es obligatorio" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Cargo"
                  error={!!errors.Cargo}
                  helperText={errors.Cargo?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="Estado"
              control={control}
              rules={{
                validate: (value) =>
                  value === true || value === false || "El estado es obligatorio",
              }}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.Estado}>
                  <InputLabel id="estado-label">Estado</InputLabel>
                  <Select
                    labelId="estado-label"
                    label="Estado"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value === "true")}
                  >
                    <MenuItem value={"true"}>Inactivo</MenuItem>
                    <MenuItem value={"false"}>Activo</MenuItem>
                  </Select>
                  {errors.Estado && (
                    <Typography variant="caption" color="error">
                      {errors.Estado.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />




            <Button
              type="submit"
              variant="contained"
              color="primary"
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
