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

export default function ProductoEliminar() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
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

    fetch(`http://spavehiculos.runasp.net/api/Productos/ObtenerPorId?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 204) throw new Error("Producto no encontrado");
        if (!res.ok) throw new Error("Error al obtener producto");
        return res.json();
      })
      .then((response) => setProducto(response.data))
      .catch(() => setError("Error al obtener el producto"));
  }, [id, navigate]);

  const handleEliminar = () => {
    const storedUser = JSON.parse(localStorage.getItem("CurrentUser"));
    const token = storedUser?.token;

    if (!token) {
      setError("No autorizado. Por favor inicia sesión.");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    fetch(`http://spavehiculos.runasp.net/api/Productos/Eliminar?id=${id}`, {
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
        setMensaje("Producto eliminado correctamente.");
        setTimeout(() => navigate("/gestion/productos"), 1500);
      })
      .catch(() => setError("Error al eliminar el producto."));
  };

  if (!producto && !error) {
    return (
      <Typography align="center" mt={4} variant="h6">
        Cargando datos del producto...
      </Typography>
    );
  }

  return (
    <Box maxWidth="600px" mx="auto" mt={6} px={3}>
      <Typography variant="h4" textAlign="center" mb={3}>
        Eliminar Producto
      </Typography>

      {mensaje && <Alert severity="success" sx={{ mb: 2 }}>{mensaje}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {producto && (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography mb={2}>
            ¿Estás seguro que deseas eliminar el siguiente producto?
          </Typography>
          <Stack spacing={1}>
            <Typography><strong>Nombre:</strong> {producto.Nombre}</Typography>
            <Typography><strong>Descripción:</strong> {producto.Descripción}</Typography>
            <Typography><strong>Precio:</strong> ${producto.Precio}</Typography>
            <Typography><strong>ID Proveedor:</strong> {producto.IdProveedor}</Typography>
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

            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate("/gestion/productos")}>
              Cancelar
            </Button>
          </Stack>
        </Paper>
      )}
    </Box>
  );
}
