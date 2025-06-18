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

export default function SedeForm() {
  const navigate = useNavigate();
  const [ciudades, setCiudades] = useState([]);
  const [loadingCiudades, setLoadingCiudades] = useState(true);
  const [errorCiudades, setErrorCiudades] = useState(null);

  useEffect(() => {
    async function fetchCiudades() {
      try {
        const storedUser = JSON.parse(
          localStorage.getItem("CurrentUser") || "null"
        );
        const token =
          storedUser?.token ||
          (typeof currentUser !== "undefined" ? currentUser?.token : null);
        if (!token)
          throw new Error("No se encontró el token de autenticación.");
        const response = await fetch(
          "https://spavehiculos.runasp.net/api/Ciudades/ConsultarTodos",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok) throw new Error("Error al cargar las ciudades");
        const data = await response.json();
        setCiudades(data.Data);
      } catch (error) {
        setErrorCiudades(error.message);
      } finally {
        setLoadingCiudades(false);
      }
    }
    fetchCiudades();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const limpiarEspacios = (texto) =>
    texto
      .replace(/\s+/g, " ") // reemplaza múltiples espacios con uno solo
      .trimStart();

  const onSubmit = async (data) => {
    try {
      const storedUser = JSON.parse(
        localStorage.getItem("CurrentUser") || "null"
      );
      const token =
        storedUser?.token ||
        (typeof currentUser !== "undefined" ? currentUser?.token : null);
      if (!token) throw new Error("No se encontró el token de autenticación.");
      const response = await fetch(
        "https://spavehiculos.runasp.net/api/Sedes/Insertar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("Error al guardar la sede");
      navigate("/sedes");
    } catch (error) {
      console.error("Error en la solicitud:", error.message);
    }
  };

  return (
    <Paper
      sx={{
        p: 5,
        maxWidth: 600,
        margin: "auto",
        mt: 6,
        boxShadow: 4,
        borderRadius: 3,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={4} textAlign="center">
        Formulario de Sede
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
          onChange={(e) => setValue("Nombre", limpiarEspacios(e.target.value))}
        />

        <TextField
          label="Dirección"
          {...register("Dirección", {
            required: "La dirección es obligatoria",
          })}
          error={!!errors.Dirección}
          helperText={errors.Dirección?.message}
          fullWidth
          onChange={(e) =>
            setValue("Dirección", limpiarEspacios(e.target.value))
          }
        />

        <FormControl
          fullWidth
          error={!!errors.IdCiudad}
          disabled={loadingCiudades}
        >
          <InputLabel id="select-ciudad-label">Ciudad</InputLabel>
          <Controller
            name="IdCiudad"
            control={control}
            defaultValue=""
            rules={{
              required: "La ciudad es obligatoria",
              validate: (value) =>
                value > 0 || "Debe seleccionar una ciudad válida",
            }}
            render={({ field }) => (
              <Select labelId="select-ciudad-label" label="Ciudad" {...field}>
                <MenuItem value="">
                  <em>
                    {loadingCiudades
                      ? "Cargando ciudades..."
                      : "Seleccione una ciudad"}
                  </em>
                </MenuItem>
                {ciudades.map((ciudad) => (
                  <MenuItem key={ciudad.IdCiudad} value={ciudad.IdCiudad}>
                    {ciudad.Nombre}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <FormHelperText>
            {errors.IdCiudad
              ? errors.IdCiudad.message
              : errorCiudades
              ? errorCiudades
              : ""}
          </FormHelperText>
        </FormControl>

        <TextField
          label="Teléfono"
          type="tel"
          {...register("Teléfono", {
            required: "El teléfono es obligatorio",
            minLength: {
              value: 7,
              message: "El teléfono debe tener al menos 7 dígitos",
            },
            maxLength: {
              value: 10,
              message: "El teléfono no debe tener más de 10 dígitos",
            },
            pattern: {
              value: /^[0-9]+$/,
              message: "Solo se permiten números",
            },
            validate: (value) =>
              !/\s/.test(value) || "El teléfono no debe contener espacios",
          })}
          error={!!errors.Teléfono}
          helperText={errors.Teléfono?.message}
          fullWidth
          onChange={(e) =>
            setValue("Teléfono", e.target.value.replace(/\s/g, ""))
          }
        />

        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          mt={3}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            color="secondary"
            onClick={() => navigate("/sedes")}
          >
            Regresar
          </Button>

          <Button variant="contained" type="submit" color="primary">
            Guardar Sede
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
