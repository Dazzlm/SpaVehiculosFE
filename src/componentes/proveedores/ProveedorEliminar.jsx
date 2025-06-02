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

function ProveedorEliminar() {
  const { id } = useParams();
  const [proveedor, setProveedor] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
   const user = JSON.parse(localStorage.getItem("CurrentUser"));

fetch(`http://spavehiculos.runasp.net/api/GestorProv/ConsultarporID?idProveedor=${id}`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user?.token}`,
  },
})
  .then((res) => {
    if (!res.ok) throw new Error();
    return res.json();
  })
  .then((data) => setProveedor(data))
  .catch(() => setError("Error al obtener proveedor"));

  }, [id]);

  const handleEliminar = () => {
   const user = JSON.parse(localStorage.getItem("CurrentUser"));

fetch(`http://spavehiculos.runasp.net/api/GestorProv/EliminarProveedor?idProveedor=${id}`, {
  method: "DELETE",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user?.token}`,
  },
})
  .then((res) => {
    if (!res.ok) throw new Error();
    return res.text();
  })
  .then(() => {
    setMensaje("Proveedor eliminado correctamente.");
    setTimeout(() => navigate("/usuarios/proveedor"), 1000);
  })
  .catch(() => setError("Error al eliminar proveedor."));

  };

  if (!proveedor) {
    return (
      <Typography align="center" mt={4} variant="h6">
        Cargando datos del proveedor...
      </Typography>
    );
  }

  return (
    <Box maxWidth="600px" mx="auto" mt={6} px={3}>
      <Typography variant="h4" textAlign="center" mb={3}>
        Eliminar Proveedor
      </Typography>

      {mensaje && <Alert severity="success" sx={{ mb: 2 }}>{mensaje}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography mb={2}>
          ¿Estás seguro que deseas eliminar al siguiente proveedor?
        </Typography>
        <Stack spacing={1}>
          <Typography><strong>Empresa:</strong> {proveedor.NombreEmpresa}</Typography>
          <Typography><strong>Contacto:</strong> {proveedor.Contacto}</Typography>
          <Typography><strong>Teléfono:</strong> {proveedor.Teléfono}</Typography>
          <Typography><strong>Email:</strong> {proveedor.Email}</Typography>
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

          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/usuarios/proveedor")}
          >
            Cancelar
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}

export default ProveedorEliminar;
