import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { crearServicio } from "../../helpers/Servicios/postServicios";
import Swal from "sweetalert2";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function CrearServicio() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await crearServicio(data);
      Swal.fire({
        icon: "success",
        title: "Servicio creado",
        text: "El servicio se ha creado correctamente",
        confirmButtonColor: "#3085d6",
      });
      navigate("/servicios");
    } catch (error) {
      console.error("Error al crear el servicio:", error.message);
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
        Crear Servicio
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
          {...register("Nombre", {
            required: "El nombre es obligatorio",
            minLength: { value: 3, message: "Mínimo 3 caracteres" },
            maxLength: { value: 50, message: "Máximo 50 caracteres" },
            validate: (value) =>
              /^([A-Za-zÁÉÍÓÚáéíóúñÑ]+ ?)*[A-Za-zÁÉÍÓÚáéíóúñÑ]+$/.test(
                value.trim()
              ) || "Solo letras, sin espacios dobles o al inicio/final",
          })}
          error={!!errors.Nombre}
          helperText={errors.Nombre?.message}
          fullWidth
          onChange={(e) => {
            const clean = e.target.value.replace(/\s{2,}/g, " ").trimStart();
            setValue("Nombre", clean);
          }}
        />

        <TextField
          label="Descripción"
          {...register("Descripción", {
            required: "La descripción es obligatoria",
            minLength: { value: 5, message: "Mínimo 5 caracteres" },
            maxLength: { value: 100, message: "Máximo 100 caracteres" },
            validate: (value) =>
              /^([A-Za-zÁÉÍÓÚáéíóúñÑ0-9]+ ?)*[A-Za-zÁÉÍÓÚáéíóúñÑ0-9]+$/.test(
                value.trim()
              ) || "Sin espacios dobles ni caracteres inválidos",
          })}
          error={!!errors.Descripción}
          helperText={errors.Descripción?.message}
          fullWidth
          onChange={(e) => {
            const clean = e.target.value.replace(/\s{2,}/g, " ").trimStart();
            setValue("Descripción", clean);
          }}
        />

        <TextField
          label="Precio"
          type="text"
          {...register("Precio", {
            required: "El precio es obligatorio",
            validate: (value) => {
              const num = parseFloat(value);
              if (!/^\d+(\.\d{1,2})?$/.test(value))
                return "Solo números válidos con dos decimales";
              if (num <= 0) return "Debe ser mayor a 0";
              if (num < 100) return "El precio mínimo es 100";
              if (num > 999999) return "El precio máximo es 999999";
              return true;
            },
          })}
          error={!!errors.Precio}
          helperText={errors.Precio?.message}
          fullWidth
          onChange={(e) => {
            const numeric = e.target.value.replace(/\s/g, "");
            setValue("Precio", numeric);
          }}
        />

        <TextField
          label="Duración (minutos)"
          type="text"
          {...register("DuraciónMinutos", {
            required: "La duración es obligatoria",
            validate: (value) => {
              const num = parseInt(value);
              if (!/^\d+$/.test(value)) return "Solo números enteros";
              if (num <= 0) return "Debe ser mayor a 0";
              if (num < 5) return "Mínimo 5 minutos";
              if (num > 240) return "Máximo 240 minutos";
              return true;
            },
          })}
          error={!!errors.DuraciónMinutos}
          helperText={errors.DuraciónMinutos?.message}
          fullWidth
          onChange={(e) => {
            const onlyDigits = e.target.value.replace(/\D/g, "");
            setValue("DuraciónMinutos", onlyDigits);
          }}
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
            onClick={() => navigate("/servicios")}
          >
            Regresar
          </Button>

          <Button variant="contained" type="submit" color="primary">
            Guardar Servicio
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
