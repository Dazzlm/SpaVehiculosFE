import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Button,
  Box,
  Paper,
  Stack,
  Alert,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function ClienteEliminar() {
  const { id } = useParams();
  const [cliente, setCliente] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("CurrentUser"));
    const token = storedUser?.token;

    if (!token) {
      setError("No autorizado. Por favor inicia sesión.");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    fetch(`https://spavehiculos.runasp.net/api/Clientes/ConsultarXId?idCliente=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (res.status === 204) throw new Error("Cliente no encontrado");
        if (!res.ok) throw new Error("Error al obtener cliente");
        const data = await res.json();
        setCliente(data.Data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error al obtener cliente");
        setLoading(false);
      });
  }, [id, navigate]);

  const handleEliminar = async () => {
    setMensaje("");
    setError("");
    const storedUser = JSON.parse(localStorage.getItem("CurrentUser"));
    const token = storedUser?.token;

    if (!token) {
      setError("No autorizado. Por favor inicia sesión.");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    try {
      const res = await fetch(
        `https://spavehiculos.runasp.net/api/Clientes/EliminarClienteUsuario?idCliente=${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const respuestaTexto = await res.json();

      if (!res.ok) throw new Error(respuestaTexto.Message);

      setMensaje(respuestaTexto.mensaje);
      setTimeout(() => navigate("/usuarios/cliente"), 1500);
    } catch (err) {
      setError(err.message || "Error al eliminar cliente");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth="500px" mx="auto" mt={4} px={2}>
      <Typography variant="h5" textAlign="center" mb={2}>
        Eliminar Cliente
      </Typography>

      {mensaje && (
        <Alert severity="success" sx={{ mb: 1 }}>
          {mensaje}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {error}
        </Alert>
      )}

      {cliente && (
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
          <Typography mb={1} fontWeight="medium" fontSize="1rem">
            ¿Seguro que deseas eliminar este cliente?
          </Typography>
          <Stack spacing={0.5} mb={3}>
            <Typography variant="body2">
              <strong>Nombre:</strong> {cliente.Nombre} {cliente.Apellidos}
            </Typography>
            <Typography variant="body2">
              <strong>Email:</strong> {cliente.Email}
            </Typography>
            <Typography variant="body2">
              <strong>Teléfono:</strong> {cliente.Teléfono}
            </Typography>
            <Typography variant="body2">
              <strong>Dirección:</strong> {cliente.Dirección}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              variant="contained"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={handleEliminar}
            >
              Eliminar
            </Button>

            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate("/usuarios/cliente")}
            >
              Cancelar
            </Button>
          </Stack>
        </Paper>
      )}
    </Box>
  );
}

export default ClienteEliminar;
