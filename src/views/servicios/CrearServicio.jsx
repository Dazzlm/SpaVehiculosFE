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
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await crearServicio(data);
      Swal.fire({
      icon: 'success',
      title: 'Servicio creado',
      text: 'El servicio se ha creado correctamente',
      confirmButtonColor: '#3085d6'
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
            validate: (value) =>
              value > 0 || "La duración debe ser mayor a 0",
          })}
          error={!!errors.DuraciónMinutos}
          helperText={errors.DuraciónMinutos?.message}
          fullWidth
        />
      
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
            Guardar Servicio
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
