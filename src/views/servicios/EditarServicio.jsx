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
        setValue("Precio", servicio.Precio);
        setValue("DuraciónMinutos", servicio.DuraciónMinutos);
      }
    }

    cargarServicio();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      await actualizarServicio(data);
      Swal.fire({
            icon: 'success',
            title: 'Servicio Actualizado',
            confirmButtonText: 'Aceptar',
            text: 'El servicio se ha Actualizado correctamente',
            confirmButtonColor: '#3085d6'
          });
      navigate("/servicios");
    } catch (error) {
      console.error("Error al actualizar el servicio:", error.message);
    }
  };

  if (!servicioCargado) {
    return <Typography align="center" mt={5}>Cargando servicio...</Typography>;
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
        bgcolor: "background.paper",
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
          {...register("Nombre", { required: "El nombre es obligatorio" })}
          error={!!errors.Nombre}
          helperText={errors.Nombre?.message}
          fullWidth
        />
        <TextField
          label="Descripción"
          {...register("Descripción", { required: "La descripción es obligatoria" })}
          error={!!errors.Descripción}
          helperText={errors.Descripción?.message}
          fullWidth
        />
        <TextField
          label="Precio"
          type="number"
          {...register("Precio", {
            required: "El precio es obligatorio",
            valueAsNumber: true,
            validate: (value) => value > 0 || "El precio debe ser mayor a 0",
          })}
          error={!!errors.Precio}
          helperText={errors.Precio?.message}
          fullWidth
        />
        <TextField
          label="Duración (minutos)"
          type="number"
          {...register("DuraciónMinutos", {
            required: "La duración es obligatoria",
            valueAsNumber: true,
            validate: (value) => value > 0 || "La duración debe ser mayor a 0",
          })}
          error={!!errors.DuraciónMinutos}
          helperText={errors.DuraciónMinutos?.message}
          fullWidth
        />

        <input type="hidden" {...register("IdServicio")} />

        <Stack direction="row" spacing={2} justifyContent="space-between" mt={3}>
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
