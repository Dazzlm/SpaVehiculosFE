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

function SedeEliminar() {
  const { id } = useParams();
  const [sede, setSede] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("CurrentUser"));
    const token = storedUser?.token;

    if (!token) {
      setError("No autorizado. Por favor inicia sesión.");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    fetch(`https://spavehiculos.runasp.net/api/Sedes/ConsultarXId?idSede=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setSede(data.Data))
      .catch(() => setError("Error al obtener la sede"));
  }, [id, navigate]);

  const handleEliminar = () => {
    const storedUser = JSON.parse(localStorage.getItem("CurrentUser"));
    const token = storedUser?.token;

    if (!token) {
      setError("No autorizado. Por favor inicia sesión.");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    fetch(`https://spavehiculos.runasp.net/api/Sedes/EliminarXId?idSede=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar");
        return res.text();
      })
      .then(() => {
        setMensaje("Sede eliminada correctamente.");
        setTimeout(() => navigate("/sedes"), 1000);
      })
      .catch(() => setError("Error al eliminar la sede."));
  };

  if (!sede && !error) {
    return (
      <Typography align="center" mt={4} variant="h6">
        Cargando datos de la sede...
      </Typography>
    );
  }

  return (
    <Box maxWidth="600px" mx="auto" mt={6} px={3}>
      <Typography variant="h4" textAlign="center" mb={3}>
        Eliminar Sede
      </Typography>

      {mensaje && <Alert severity="success" sx={{ mb: 2 }}>{mensaje}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {sede && (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography mb={2}>
            ¿Estás seguro que deseas eliminar la siguiente sede?
          </Typography>
          <Stack spacing={1}>
            <Typography><strong>Nombre:</strong> {sede.Nombre}</Typography>
            <Typography><strong>Dirección:</strong> {sede.Dirección}</Typography>
            <Typography><strong>Teléfono:</strong> {sede.Teléfono}</Typography>
            <Typography><strong>Ciudad:</strong> {sede.nombreCiudad ?? sede.IdCiudad}</Typography>
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

            <Button variant="outlined" onClick={() => navigate("/sedes")}>
              Cancelar
            </Button>
          </Stack>
        </Paper>
      )}
    </Box>
  );
}

export default SedeEliminar;
