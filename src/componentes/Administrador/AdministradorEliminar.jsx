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

function AdministradorEliminar() {
  const { id } = useParams();
  const [administrador, setAdministrador] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://spavehiculos.runasp.net/api/GestorAdmin/ConsultarPorID?idAdmin=${id}`)
      .then((res) => res.json())
      .then((data) => setAdministrador(data))
      .catch(() => setError("Error al obtener administrador"));
  }, [id]);

  const handleEliminar = () => {
    fetch(`http://spavehiculos.runasp.net/api/GestorAdmin/EliminarAdmin?idAdmin=${id}`, {
      method: "DELETE",
    })
      .then((res) => res.text())
      .then(() => {
        setMensaje("Administrador eliminado correctamente.");
        setTimeout(() => navigate("/usuarios/administrador"), 1000);
      })
      .catch(() => setError("Error al eliminar administrador."));
  };

  if (!administrador) {
    return (
      <Typography align="center" mt={4} variant="h6">
        Cargando datos del administrador...
      </Typography>
    );
  }

  return (
    <Box maxWidth="600px" mx="auto" mt={6} px={3}>
      <Typography variant="h4" textAlign="center" mb={3}>
        Eliminar Administrador
      </Typography>

      {mensaje && <Alert severity="success" sx={{ mb: 2 }}>{mensaje}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography mb={2}>
          ¿Estás seguro que deseas eliminar al siguiente administrador?
        </Typography>
        <Stack spacing={1}>
          <Typography><strong>Nombre:</strong> {administrador.Nombre} {administrador.Apellidos}</Typography>
          <Typography><strong>Email:</strong> {administrador.Email}</Typography>
          <Typography><strong>Teléfono:</strong> {administrador.Teléfono}</Typography>
          <Typography><strong>Dirección:</strong> {administrador.Direccion}</Typography>
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

          <Button variant="outlined" onClick={() => navigate("/usuarios/administrador")}>
            Cancelar
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default AdministradorEliminar;
