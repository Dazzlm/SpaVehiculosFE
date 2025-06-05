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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function StockEliminar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [stockInfo, setStockInfo] = useState(null);
  const [producto, setProducto] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("CurrentUser"));
  const token = user?.token;

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);

        const resStock = await fetch(
          `https://spavehiculos.runasp.net/api/StockSedes/ConsultarPorIdSedeProducto?idSedeProducto=${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!resStock.ok) throw new Error("Error al obtener stock");
        const dataStock = await resStock.json();
        setStockInfo(dataStock.data);

        const resProd = await fetch(
          `https://spavehiculos.runasp.net/api/Productos/ObtenerPorId?id=${dataStock.data.IdProducto}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!resProd.ok) throw new Error("Error al obtener producto");
        const dataProd = await resProd.json();
        setProducto(dataProd.data);

        setError("");
      } catch {
        setError("Error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id, token]);

  const handleEliminar = async () => {
    try {
      const res = await fetch(
        `https://spavehiculos.runasp.net/api/StockSedes/EliminarPorId?idSedeProducto=${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Error al eliminar stock");

      setMensaje("Stock eliminado correctamente.");
      setTimeout(() => navigate("/gestion/stock"), 1500);
    } catch {
      setError("Error al eliminar stock.");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!stockInfo || !producto) {
    return (
      <Typography color="error" align="center" mt={4}>
        No se pudo cargar la información.
      </Typography>
    );
  }

  return (
    <Box maxWidth="600px" mx="auto" mt={6} px={3}>
      <Typography variant="h4" textAlign="center" mb={3}>
        Eliminar Stock del Producto
      </Typography>

      {mensaje && <Alert severity="success" sx={{ mb: 2 }}>{mensaje}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography mb={2}>
          ¿Estás seguro que deseas eliminar el siguiente stock?
        </Typography>

        <Stack spacing={1}>
          <Typography><strong>ID Producto:</strong> {producto.IdProducto}</Typography>
          <Typography><strong>Nombre:</strong> {producto.Nombre}</Typography>
          <Typography><strong>Descripción:</strong> {producto.Descripción}</Typography>
          <Typography><strong>Precio:</strong> ${producto.Precio.toLocaleString()}</Typography>
          <Typography><strong>Stock Disponible:</strong> {stockInfo.StockDisponible}</Typography>
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
            onClick={() => navigate("/gestion/stock")}
          >
            Cancelar
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
