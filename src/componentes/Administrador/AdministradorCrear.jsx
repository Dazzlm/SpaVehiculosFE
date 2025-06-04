import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Stack,
  InputAdornment,
  FormControl,
   InputLabel, Select,
    MenuItem, FormHelperText,
} from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';



export default function AdministradorForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const user = JSON.parse(localStorage.getItem("CurrentUser"));

const response = await fetch(
  "http://spavehiculos.runasp.net/api/GestorAdmin/InsertarAdminUsuario",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user?.token}`,
    },
    body: JSON.stringify(data),
  }
);


      if (!response.ok) {
        throw new Error("Error al guardar el administrador");
      }

      navigate("/usuarios/administradores");
    } catch (error) {
      console.error("Error en la solicitud:", error.message);
    }
  };

  return (
    <Paper
      sx={{
        maxWidth: 600,
        margin: "auto",
        mt: 6,
        boxShadow: 4,
        borderRadius: 3,
        bgcolor: "background.paper",
        height: "70vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          p: 3,
          pb: 0,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          borderRadius: "12px 12px 0 0",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          color="primary"
        >
          Crear Administrador
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 3,
        }}
      >
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
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: "primary.main" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Apellidos"
            {...register("Apellidos", {
              required: "Los apellidos son obligatorios",
            })}
            error={!!errors.Apellidos}
            helperText={errors.Apellidos?.message}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: "primary.main" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Email"
            type="email"
            {...register("Email", {
              required: "El email es obligatorio",
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: "Email no es válido",
              },
            })}
            error={!!errors.Email}
            helperText={errors.Email?.message}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: "primary.main" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Teléfono"
            {...register("Telefono", {
              required: "El teléfono es obligatorio",
            })}
            error={!!errors.Teléfono}
            helperText={errors.Teléfono?.message}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon sx={{ color: "primary.main" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Cédula"
            {...register("Cedula", {
              required: "La cédula es obligatoria",
              pattern: {
                value: /^[0-9]{6,15}$/,
                message: "Cédula no válida",
              },
            })}
            error={!!errors.Cedula}
            helperText={errors.Cedula?.message}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeIcon sx={{ color: "primary.main" }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Fecha de Nacimiento"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register("FechaNacimiento", {
              required: "La fecha de nacimiento es obligatoria",
            })}
            error={!!errors.FechaNacimiento}
            helperText={errors.FechaNacimiento?.message}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon sx={{ color: "primary.main" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Cargo"
            {...register("Cargo", { required: "El cargo es obligatorio" })}
            error={!!errors.Cargo}
            helperText={errors.Cargo?.message}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SupervisorAccountIcon sx={{ color: "primary.main" }} />
                </InputAdornment>
              ),
            }}
          />

           <TextField
            label="Usuario"
            {...register("NombreUsuario", {
              required: "El nombre de usuario es obligatorio",
            },
            )}
            error={!!errors.NombreUsuario}
            helperText={errors.NombreUsuario?.message}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeIcon sx={{ color: "primary.main" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Contraseña"
            type="password"
            {...register("Contrasena", {
              required: "La contraseña es obligatoria",
              minLength: {
                value: 6,
                message: "La contraseña debe tener al menos 6 caracteres",
              },
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/,
                message: "Debe contener letras y números",
              },
            })}
            error={!!errors.Contrasena}
            helperText={errors.Contrasena?.message}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: "primary.main" }} />
                </InputAdornment>
              ),
            }}
          />

          <FormControl fullWidth error={!!errors.Estado}>
            <InputLabel id="estado-label">Estado</InputLabel>
              <Select
                labelId="estado-label"
                label="Estado"
               defaultValue=""
                {...register("Estado", {
                 validate: (value) =>
                    value === "true" || value === "false" || "El estado es obligatorio",
                })}
              >
                <MenuItem value="true">Inactivo</MenuItem>
                <MenuItem value="false">Activo</MenuItem>
              </Select>
              <FormHelperText>{errors.Estado?.message}</FormHelperText>
            </FormControl>

          <Stack direction="row" spacing={2} justifyContent="space-between" mt={3} mb={2}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              color="secondary"
              onClick={() => navigate("/usuarios/administradores")}
            >
              Regresar
            </Button>

            <Button variant="contained" type="submit" color="primary">
              Guardar Administrador
            </Button>
          </Stack>
        </Box>
      </Box>
    </Paper>
  );
}