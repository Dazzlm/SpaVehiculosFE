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

  const reglas = (campo, min, max, regex = null, mensajeRegex = "") => ({
    required: `El campo ${campo} es obligatorio`,
    minLength: {
      value: min,
      message: `Debe tener al menos ${min} caracteres`,
    },
    maxLength: {
      value: max,
      message: `No puede exceder los ${max} caracteres`,
    },
    validate: (value) => {
      const limpio = value.trim();
      if (limpio === "") return `El campo ${campo} no puede estar vacío`;
      if (/\s{2,}/.test(limpio)) return `No debe contener espacios dobles`;
      if (regex && !regex.test(limpio)) return mensajeRegex;
      return true;
    },
  });

  const limpiarCampo =
    (field, tipo = "texto") =>
    (e) => {
      let valor = e.target.value;

      if (["email", "telefono", "cedula"].includes(tipo)) {
        valor = valor.replace(/\s+/g, ""); // elimina todos los espacios
      } else {
        valor = valor.replace(/\s{2,}/g, " "); // un solo espacio entre palabras
        valor = valor.trimStart(); // elimina espacio inicial
      }

      field.onChange(valor);
    };

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

        if (data.Data.FechaNacimiento)
          data.Data.FechaNacimiento = data.Data.FechaNacimiento.split("T")[0];
        reset(data.Data);
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
              rules={reglas("Nombre", 2, 40)}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nombre"
                  error={!!errors.Nombre}
                  helperText={errors.Nombre?.message}
                  fullWidth
                  onChange={limpiarCampo(field)}
                />
              )}
            />
            <Controller
              name="Apellidos"
              control={control}
              rules={reglas("Apellidos", 2, 40)}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Apellidos"
                  error={!!errors.Apellidos}
                  helperText={errors.Apellidos?.message}
                  fullWidth
                  onChange={limpiarCampo(field)}
                />
              )}
            />
            <Controller
              name="Email"
              control={control}
              rules={reglas(
                "Email",
                5,
                60,
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Formato de correo inválido"
              )}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  error={!!errors.Email}
                  helperText={errors.Email?.message}
                  fullWidth
                  onChange={limpiarCampo(field, "email")}
                />
              )}
            />
            <Controller
              name="Telefono"
              control={control}
              rules={reglas(
                "Teléfono",
                7,
                10,
                /^[0-9-]+$/,
                "Solo números o guiones"
              )}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Teléfono"
                  error={!!errors.Telefono}
                  helperText={errors.Telefono?.message}
                  fullWidth
                  onChange={limpiarCampo(field, "telefono")}
                />
              )}
            />
            <Controller
              name="Cedula"
              control={control}
              rules={reglas("Cédula", 5, 10, /^[0-9]+$/, "Solo números")}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Cédula"
                  error={!!errors.Cedula}
                  helperText={errors.Cedula?.message}
                  fullWidth
                  onChange={limpiarCampo(field, "cedula")}
                />
              )}
            />
            <Controller
              name="NombreUsuario"
              control={control}
              rules={reglas("Nombre de Usuario", 3, 30)}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nombre de Usuario"
                  error={!!errors.NombreUsuario}
                  helperText={errors.NombreUsuario?.message}
                  fullWidth
                  onChange={limpiarCampo(field)}
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
              rules={reglas("Cargo", 2, 30)}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Cargo"
                  error={!!errors.Cargo}
                  helperText={errors.Cargo?.message}
                  fullWidth
                  onChange={limpiarCampo(field)}
                />
              )}
            />
            <Controller
              name="Estado"
              control={control}
              rules={{
                validate: (value) =>
                  value === true ||
                  value === false ||
                  "El estado es obligatorio",
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
