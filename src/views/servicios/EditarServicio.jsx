import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { actualizarServicio } from "../../helpers/Servicios/putServicio";
import { getServicio } from "../../helpers/Servicios/getServicio";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

// ...importaciones
export default function EditarServicio() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [servicioCargado, setServicioCargado] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    async function cargarServicio() {
      const todos = await getServicio();
      const servicio = todos.find((s) => s.IdServicio === parseInt(id));
      if (servicio) {
        setServicioCargado(servicio);
        setValue("IdServicio", servicio.IdServicio);
        setValue("Nombre", servicio.Nombre);
        setValue("Descripción", servicio.Descripción);
        setValue("Precio", servicio.Precio.toString());
        setValue("DuraciónMinutos", servicio.DuraciónMinutos.toString());
      }
    }
    cargarServicio();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      await actualizarServicio(data);
      Swal.fire({
        icon: "success",
        title: "Servicio Actualizado",
        text: "El servicio se ha Actualizado correctamente",
        confirmButtonColor: "#3085d6",
      });
      navigate("/servicios");
    } catch (error) {
      console.error("Error al actualizar el servicio:", error.message);
    }
  };

  if (!servicioCargado) {
    return (
      <Typography align="center" mt={5}>
        Cargando servicio...
      </Typography>
    );
  }

  return (
    <Paper
      sx={{
        p: 5,
        maxWidth: 600,
        margin: "auto",
        mt: 6,
        boxShadow: 4,
        borderRadius: 3,
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={4} textAlign="center">
        Editar Servicio
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
          onChange={(e) =>
            setValue("Nombre", e.target.value.replace(/\s{2,}/g, " "))
          }
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
          onChange={(e) =>
            setValue("Descripción", e.target.value.replace(/\s{2,}/g, " "))
          }
        />

        <TextField
          label="Precio"
          type="text"
          {...register("Precio", {
            required: "El precio es obligatorio",
            validate: (value) => {
              const num = parseFloat(value);
              if (!/^\d+(\.\d{1,2})?$/.test(value))
                return "Solo números válidos dos decimales";
              if (num <= 0) return "Debe ser mayor a 0";
              if (num < 100) return "El precio mínimo es 100";
              if (num > 999999) return "El precio máximo es 999999";
              return true;
            },
          })}
          error={!!errors.Precio}
          helperText={errors.Precio?.message}
          fullWidth
          onChange={(e) =>
            setValue("Precio", e.target.value.replace(/\s/g, ""))
          }
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
          onChange={(e) =>
            setValue("DuraciónMinutos", e.target.value.replace(/\D/g, ""))
          }
        />

        <input type="hidden" {...register("IdServicio")} />

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
            Actualizar Servicio
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
