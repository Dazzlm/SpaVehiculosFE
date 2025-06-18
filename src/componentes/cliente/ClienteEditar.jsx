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

    fetch(
      `https://spavehiculos.runasp.net/api/Clientes/ConsultarClienteUsuario?id=${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
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
        ...Object.fromEntries(
          Object.entries(data).map(([key, value]) => [
            key,
            typeof value === "string"
              ? value.trim().replace(/\s+/g, " ")
              : value,
          ])
        ),
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
    <Box display="flex" justifyContent="center" p={2}>
      <Paper
        elevation={6}
        sx={{ maxWidth: 400, width: "100%", p: 3, borderRadius: 2 }}
      >
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

        <Typography
          variant="h4"
          fontWeight="bold"
          color="primary"
          mb={3}
          align="center"
        >
          Editar Cliente
        </Typography>

        {mensaje && (
          <Alert
            severity={
              mensaje.toLowerCase().includes("error") ? "error" : "success"
            }
            sx={{ mb: 2, borderRadius: 2 }}
          >
            {mensaje}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Box display="flex" flexDirection="column" gap={3}>
            {[
              { name: "Nombre", label: "Nombre", min: 2, max: 40 },
              { name: "Apellidos", label: "Apellidos", min: 2, max: 50 },
              {
                name: "Email",
                label: "Email",
                min: 5,
                max: 60,
                regex: /\S+@\S+\.\S+/,
                mensajeRegex: "El correo no es válido",
                type: "email",
              },
              {
                name: "Telefono",
                label: "Teléfono",
                min: 7,
                max: 10,
                regex: /^[0-9-]+$/,
                mensajeRegex:
                  "El teléfono solo debe contener números o guiones",
              },
              { name: "Direccion", label: "Dirección", min: 5, max: 100 },
              {
                name: "DocumentoUsuario",
                label: "Documento Usuario",
                min: 5,
                max: 10,
                regex: /^[0-9]+$/,
                mensajeRegex: "El documento solo debe contener números",
              },
              {
                name: "NombreUsuario",
                label: "Nombre Usuario",
                min: 3,
                max: 20,
              },
            ].map(({ name, label, min, max, type, regex, mensajeRegex }) => (
              <Controller
                key={name}
                name={name}
                control={control}
                rules={reglas(label, min, max, regex, mensajeRegex)}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={label}
                    fullWidth
                    size="large"
                    type={type || "text"}
                    error={!!errors[name]}
                    helperText={errors[name]?.message}
                    onChange={(e) => {
                      let value = e.target.value;
                      if (name === "Email") {
                        value = value.replace(/\s+/g, "");
                      } else {
                        value = value.replace(/\s+/g, " ").trimStart();
                      }
                      field.onChange(value);
                    }}
                  />
                )}
              />
            ))}

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
