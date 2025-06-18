import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

export default function StockEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [stockInfo, setStockInfo] = useState(null);
  const [producto, setProducto] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const user = JSON.parse(localStorage.getItem("CurrentUser"));
  const token = user?.token;

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const res = await fetch(
          `https://spavehiculos.runasp.net/api/StockSedes/ConsultarPorIdSedeProducto?idSedeProducto=${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Error al obtener stock");

        const data = await res.json();
        setStockInfo(data.Data);

        const resProducto = await fetch(
          `https://spavehiculos.runasp.net/api/Productos/ObtenerPorId?id=${data.Data.IdProducto}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!resProducto.ok) throw new Error("Error al obtener producto");

        const prod = await resProducto.json();
        setProducto(prod.Data);
      } catch (error) {
        setMensaje("Error al cargar datos.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [id, token]);

  const handleGuardar = async () => {
    if (stockInfo.StockDisponible < 0) {
      setMensaje("El stock no puede ser negativo.");
      return;
    }

    setUpdating(true);
    try {
      const res = await fetch(
        "https://spavehiculos.runasp.net/api/StockSedes/Actualizar",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(stockInfo),
        }
      );

      if (!res.ok) throw new Error();
      setMensaje("Stock actualizado correctamente");
      setTimeout(() => navigate("/gestion/stock"), 1500);
    } catch {
      setMensaje("Error al actualizar el stock");
    } finally {
      setUpdating(false);
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
    return <Typography color="error">No se pudo cargar la información.</Typography>;
  }

  return (
    <Box display="flex" justifyContent="center" p={2}>
      <Paper sx={{ p: 4, borderRadius: 4, width: "100%", maxWidth: 700 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/gestion/stock")}
          sx={{ mb: 3, textTransform: "none", fontWeight: "bold" }}
        >
          Volver
        </Button>

        <Typography variant="h5" fontWeight="bold" mb={3} color="primary">
          Editar Stock del Producto
        </Typography>

        {mensaje && (
          <Alert
            severity={
              mensaje.includes("Error") || mensaje.includes("negativo")
                ? "error"
                : "success"
            }
            sx={{ mb: 3 }}
          >
            {mensaje}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="ID Producto" value={producto.IdProducto} fullWidth disabled />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Nombre" value={producto.Nombre} fullWidth disabled />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Descripción"
              value={producto.Descripción}
              fullWidth
              disabled
              multiline
              minRows={2}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Precio"
              value={`$${producto.Precio.toLocaleString()}`}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Stock Disponible"
              type="number"
              value={stockInfo.StockDisponible}
              onChange={(e) =>
                setStockInfo({
                  ...stockInfo,
                  StockDisponible: parseInt(e.target.value),
                })
              }
              inputProps={{ min: 0 }}
              fullWidth
              required
            />
          </Grid>
        </Grid>

        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleGuardar}
          disabled={updating}
          sx={{ mt: 4, fontWeight: "bold" }}
        >
          {updating ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </Paper>
    </Box>
  );
}

