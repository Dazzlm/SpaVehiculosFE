import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Stack,
  Alert,
  Box,
  Divider,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import swal from "sweetalert2";
import { useSpaVehiculosStore } from "../../zustand/SpaVehiculosStore";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

const AgregarProductoASede = () => {
  const { currentSede } = useSpaVehiculosStore();
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      IdProducto: "",
      StockDisponible: "",
    },
  });

  const [productos, setProductos] = useState([]);
  const [productosSede, setProductosSede] = useState([]);
  const [apiError, setApiError] = useState(null);

  const API_BASE = "http://spavehiculos.runasp.net/api";

  const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem("CurrentUser"));
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${user?.token || ""}`,
    };
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [productosRes, productosSedeRes] = await Promise.all([
          fetch(`${API_BASE}/Productos/ObtenerTodos`, {
            headers: getAuthHeaders(),
          }),
          fetch(`${API_BASE}/StockSedes/ConsultarPorID?idSedeProducto=${currentSede}`, {
            headers: getAuthHeaders(),
          }),
        ]);

        const productosData = await productosRes.json();
        const productosSedeData = await productosSedeRes.json();

        if (productosRes.ok) {
          setProductos(productosData.data || []);
        }

        if (productosSedeRes.ok) {
          setProductosSede(productosSedeData.data || []);
        }

        if (!productosRes.ok && !productosSedeRes.ok) {
          throw new Error("Error al obtener datos.");
        }

        setApiError(null);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setApiError("No se pudieron cargar los datos. Intente nuevamente.");
      }
    };

    cargarDatos();
  }, [currentSede]);

  const onSubmit = async (data) => {
    setApiError(null);

    const productoExiste = productosSede.some(
      (p) => p.IdProducto === parseInt(data.IdProducto)
    );

    if (productoExiste) {
      setApiError("Este producto ya está registrado en la sede.");
      return;
    }

    const body = {
      IdSede: currentSede,
      IdProducto: parseInt(data.IdProducto),
      StockDisponible: parseInt(data.StockDisponible),
    };

    try {
      const response = await fetch(`${API_BASE}/StockSedes/Crear`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Error al agregar producto.");
      }

      swal.fire({
        icon: "success",
        title: "Producto agregado",
        text: "El producto fue asignado correctamente a la sede.",
        confirmButtonColor: "#3085d6",
      });

      reset();
      navigate("/gestion/stock");
    } catch (error) {
      console.error("Error al agregar producto:", error);
      setApiError(error.message);
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        p: 5,
        maxWidth: 600,
        margin: "auto",
        mt: 6,
        borderRadius: 4,
        bgcolor: "background.paper",
      }}
    >
      <Box mb={2}>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/gestion/stock")}
        >
          Volver
        </Button>
      </Box>

      <Typography
        variant="h5"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
      >
        Agregar Producto a Sede
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {apiError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {apiError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate autoComplete="off">
        <Stack spacing={3}>
          <Controller
            name="IdProducto"
            control={control}
            rules={{ required: "El producto es obligatorio" }}
            render={({ field }) => (
              <TextField
                select
                label="Producto"
                fullWidth
                {...field}
                error={!!errors.IdProducto}
                helperText={errors.IdProducto?.message}
              >
                <MenuItem value="">
                  <em>Seleccione un producto</em>
                </MenuItem>
                {productos.map((p) => (
                  <MenuItem key={p.IdProducto} value={p.IdProducto}>
                    {p.Nombre}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <Controller
            name="StockDisponible"
            control={control}
            rules={{
              required: "El stock es obligatorio",
              min: { value: 1, message: "El stock debe ser mayor que cero" },
            }}
            render={({ field }) => (
              <TextField
                label="Stock Disponible"
                type="number"
                fullWidth
                {...field}
                error={!!errors.StockDisponible}
                helperText={errors.StockDisponible?.message}
              />
            )}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            color="primary"
            startIcon={<AddShoppingCartIcon />}
          >
            Agregar Producto
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default AgregarProductoASede;
