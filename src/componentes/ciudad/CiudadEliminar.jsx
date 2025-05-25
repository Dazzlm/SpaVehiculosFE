import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Box,
  Paper,
  Stack,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function CiudadEliminar() {
  const { id } = useParams();
  const [ciudad, setCiudad] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://localhost:44376/api/Ciudades/ConsultarXId?idCiudad=${id}`)
      .then((res) => {
        if (res.status === 204) throw new Error("Ciudad no encontrada");
        if (!res.ok) throw new Error("Error al obtener la ciudad");
        return res.json();
      })
      .then((data) => setCiudad(data))
      .catch(() => setError("Error al obtener la ciudad"));
  }, [id]);

  const handleEliminar = () => {
    fetch(`https://localhost:44376/api/Ciudades/EliminarXId?idCiudad=${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar");
        return res.text();
      })
      .then(() => {
        setMensaje("Ciudad eliminada correctamente.");
        setTimeout(() => navigate("/ciudades"), 1000);
      })
      .catch(() => setError("Error al eliminar la ciudad."));
  };

  if (!ciudad) {
    return (
      <Typography align="center" mt={4} variant="h6">
        Cargando datos de la ciudad...
      </Typography>
    );
  }

  return (
    <Box maxWidth="600px" mx="auto" mt={6} px={3}>
      <Typography variant="h4" textAlign="center" mb={3}>
        Eliminar Ciudad
      </Typography>

      {mensaje && <Alert severity="success" sx={{ mb: 2 }}>{mensaje}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography mb={2}>
          ¿Estás seguro que deseas eliminar la siguiente ciudad?
        </Typography>
        <Stack spacing={1}>
          <Typography><strong>Nombre:</strong> {ciudad.Nombre}</Typography>
        </Stack>

        <Stack direction="row" spacing={2} mt={4}>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleEliminar}
          >
            Confirmar Eliminación
          </Button>

          <Button variant="outlined" onClick={() => navigate("/ciudades")}>
            Cancelar
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default CiudadEliminar;
