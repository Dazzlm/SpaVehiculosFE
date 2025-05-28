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
    fetch(`http://spavehiculos.runasp.net/api/Sedes/ConsultarXId?idSede=${id}`)
      .then((res) => res.json())
      .then((data) => setSede(data))
      .catch((err) => console.error("Error al cargar la sede", err));
  }, [id]);

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
    { icon: <LocationCityIcon color="primary" sx={{ fontSize: 28 }} />, label: "Ciudad:", value: sede.nombreCiudad ?? sede.IdCiudad },
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
        onClick={() => navigate("/sedes")}
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

      <Typography variant="h4" component="h2" gutterBottom textAlign="center" fontWeight="700" color="primary.main">
        Detalle de la Sede
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
                <Typography fontWeight={500} color="text.primary" sx={{ wordBreak: "break-word" }}>
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

export default SedeDetalle;
