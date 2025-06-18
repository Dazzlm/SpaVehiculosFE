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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import ApartmentIcon from '@mui/icons-material/Apartment';

function SedeDetalle() {
  const { id } = useParams();
  const [sede, setSede] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const storedUser = JSON.parse(localStorage.getItem("CurrentUser"));
      const token = storedUser?.token;

      if (!token) {
        console.warn("No se encontró token, redirigiendo al login...");
        navigate("/login");
        return;
      }

      try {
        // Obtener sede
        const resSede = await fetch(`https://spavehiculos.runasp.net/api/Sedes/ConsultarXId?idSede=${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!resSede.ok) throw new Error("Error al obtener sede");
        const sedeData = await resSede.json();

        // Obtener ciudades
        const resCiudades = await fetch("https://spavehiculos.runasp.net/api/Ciudades/ConsultarTodos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resCiudades.ok) throw new Error("Error al obtener ciudades");
        const ciudades = await resCiudades.json();

        const ciudad = ciudades.Data.find(c => c.IdCiudad === sedeData.Data.IdCiudad);
        sedeData.Data.NombreCiudad = ciudad?.Nombre || "Desconocida";

        setSede(sedeData.Data);

      } catch (error) {
        console.error("Error al cargar datos:", error.message);
        setSede(null);
      }
    };

    fetchData();
  }, [id, navigate]);

  if (!sede)
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
        <CircularProgress color="primary" />
        <Typography mt={2} variant="h6" color="text.secondary">
          Cargando sede...
        </Typography>
      </Box>
    );

  const detalles = [
    { icon: <BadgeIcon color="primary" sx={{ fontSize: 28 }} />, label: "ID Sede:", value: sede.IdSede },
    { icon: <ApartmentIcon color="primary" sx={{ fontSize: 28 }} />, label: "Nombre:", value: sede.Nombre },
    { icon: <HomeIcon color="primary" sx={{ fontSize: 28 }} />, label: "Dirección:", value: sede.Dirección },
    { icon: <PhoneIcon color="primary" sx={{ fontSize: 28 }} />, label: "Teléfono:", value: sede.Teléfono },
    { icon: <LocationCityIcon color="primary" sx={{ fontSize: 28 }} />, label: "Ciudad:", value: sede.NombreCiudad },
  ];

  return (
    <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
      <Paper elevation={4} sx={{ p: 5, borderRadius: 4, width: "100%", maxWidth: 600 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/sedes")}
          sx={{ mb: 4 }}
        >
          Volver
        </Button>

        <Typography variant="h4" fontWeight="bold" color="primary" mb={3} align="center">
          Detalles de la Sede
        </Typography>

        <Stack spacing={3}>
          {detalles.map((detalle, index) => (
            <Box key={index} display="flex" alignItems="center" gap={2}>
              {detalle.icon}
              <Typography variant="subtitle1" fontWeight="bold">
                {detalle.label}
              </Typography>
              <Typography variant="subtitle1">{detalle.value}</Typography>
            </Box>
          ))}
        </Stack>

        <Divider sx={{ my: 4 }} />
      </Paper>
    </Box>
  );
}

export default SedeDetalle;
