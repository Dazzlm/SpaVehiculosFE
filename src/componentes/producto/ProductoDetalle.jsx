import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  Paper,
  Box,
  Stack,
  Divider,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import DescriptionIcon from "@mui/icons-material/Description";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("CurrentUser"));
    const token = storedUser?.token;

    if (!token) {
      console.warn("No se encontró token, redirigiendo al login...");
      navigate("/login");
      return;
    }

    const fetchProductoYProveedor = async () => {
      try {
        // Obtener producto
        const resProducto = await fetch(
          `https://spavehiculos.runasp.net/api/Productos/ObtenerPorId?id=${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!resProducto.ok)
          throw new Error(`Error al obtener producto: ${resProducto.status}`);
        const dataProducto = await resProducto.json();

        if (!dataProducto.success)
          throw new Error("Error en la respuesta del servidor");

        // Obtener nombre del proveedor
        const idProveedor = dataProducto.data.IdProveedor;
        let nombreProveedor = "Desconocido";
        if (idProveedor) {
          const resProveedor = await fetch(
            `https://spavehiculos.runasp.net/api/GestorProv/ConsultarporID?idProveedor=${idProveedor}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!resProveedor.ok)
            throw new Error(`Error al obtener proveedor: ${resProveedor.status}`);
          const dataProveedor = await resProveedor.json();
          nombreProveedor = dataProveedor?.NombreEmpresa || "Desconocido";
        }

        // Actualizar estado producto con proveedor incluido
        setProducto({ ...dataProducto.data, NombreProveedor: nombreProveedor });
      } catch (error) {
        console.error("Error al cargar datos:", error.message);
        setProducto(null);
      }
    };

    fetchProductoYProveedor();
  }, [id, navigate]);

  if (!producto)
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
        <CircularProgress color="primary" />
        <Typography mt={2} variant="h6" color="text.secondary">
          Cargando producto...
        </Typography>
      </Box>
    );

  const detalles = [
    {
      icon: <Inventory2Icon color="primary" sx={{ fontSize: 28 }} />,
      label: "ID Producto:",
      value: producto.IdProducto,
    },
    {
      icon: <DescriptionIcon color="primary" sx={{ fontSize: 28 }} />,
      label: "Nombre:",
      value: producto.Nombre,
    },
    {
      icon: <DescriptionIcon color="primary" sx={{ fontSize: 28 }} />,
      label: "Descripción:",
      value: producto.Descripción,
    },
    {
      icon: <AttachMoneyIcon color="primary" sx={{ fontSize: 28 }} />,
      label: "Precio:",
      value:
        producto.Precio !== undefined && producto.Precio !== null
          ? `$ ${producto.Precio.toFixed(2)}`
          : "-",
    },
    {
      icon: <LocalShippingIcon color="primary" sx={{ fontSize: 28 }} />,
      label: "Proveedor:",
      value: producto.NombreProveedor || "-",
    },
  ];

  return (
    <Box
      maxWidth={600}
      mx="auto"
      mt={6}
      px={4}
      py={5}
      bgcolor="background.paper"
      borderRadius={4}
      boxShadow="0 4px 20px rgba(0,0,0,0.12)"
    >
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/gestion/productos")}
        sx={{
          mb: 4,
          color: "primary.main",
          borderColor: "primary.main",
          fontWeight: "bold",
          textTransform: "none",
          transition: "all 0.3s ease",
          "&:hover": {
            bgcolor: "primary.main",
            color: "white",
            borderColor: "primary.main",
          },
        }}
      >
        Regresar
      </Button>

      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        textAlign="center"
        fontWeight="700"
        color="primary.main"
      >
        Detalle del Producto
      </Typography>

      <Paper elevation={5} sx={{ p: 4, borderRadius: 3 }}>
        <Stack spacing={3}>
          {detalles.map(({ icon, label, value }, i) => (
            <Box key={i}>
              <Stack direction="row" alignItems="center" spacing={2}>
                {icon}
                <Typography
                  fontWeight={700}
                  sx={{ minWidth: 130, color: "text.secondary" }}
                >
                  {label}
                </Typography>
                <Typography
                  fontWeight={500}
                  color="text.primary"
                  sx={{ wordBreak: "break-word" }}
                >
                  {value || "-"}
                </Typography>
              </Stack>
              {i < detalles.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}

export default ProductoDetalle;
