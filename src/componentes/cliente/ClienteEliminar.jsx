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

function ClienteEliminar() {
  const { id } = useParams();
  const [cliente, setCliente] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://spavehiculos.runasp.net/api/Clientes/ConsultarXId?idCliente=${id}`)
      .then((res) => res.json())
      .then((data) => setCliente(data))
      .catch((err) => setError("Error al obtener cliente"));
  }, [id]);

  const handleEliminar = () => {
    fetch(`http://spavehiculos.runasp.net/api/Clientes/EliminarXId?IdCliente=${id}`, {
      method: "DELETE",
    })
      .then((res) => res.text())
      .then((data) => {
        setMensaje("Cliente eliminado correctamente.");
        setTimeout(() => navigate("/usuarios/cliente"), 1000);
      })
      .catch((err) => setError("Error al eliminar cliente."));
  };

  if (!cliente) {
    return (
      <Typography align="center" mt={4} variant="h6">
        Cargando datos del cliente...
      </Typography>
    );
  }

  return (
    <Box maxWidth="600px" mx="auto" mt={6} px={3}>
      <Typography variant="h4" textAlign="center" mb={3}>
        Eliminar Cliente
      </Typography>

      {mensaje && <Alert severity="success" sx={{ mb: 2 }}>{mensaje}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography mb={2}>
          ¿Estás seguro que deseas eliminar al siguiente cliente?
        </Typography>
        <Stack spacing={1}>
          <Typography><strong>Nombre:</strong> {cliente.Nombre} {cliente.Apellidos}</Typography>
          <Typography><strong>Email:</strong> {cliente.Email}</Typography>
          <Typography><strong>Teléfono:</strong> {cliente.Teléfono}</Typography>
          <Typography><strong>Dirección:</strong> {cliente.Dirección}</Typography>
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

          <Button variant="outlined" onClick={() => navigate("/usuarios/cliente")}>
            Cancelar
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default ClienteEliminar;
