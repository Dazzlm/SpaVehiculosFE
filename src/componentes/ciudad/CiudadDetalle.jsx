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
import BadgeIcon from '@mui/icons-material/Badge';
import LocationCityIcon from '@mui/icons-material/LocationCity';

function CiudadDetalle() {
  const { id } = useParams();
  const [ciudad, setCiudad] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://localhost:44376/api/Ciudades/ConsultarXId?idCiudad=${id}`)
      .then((res) => res.json())
      .then((data) => setCiudad(data))
      .catch((err) => console.error("Error al cargar la ciudad", err));
  }, [id]);

  if (!ciudad)
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
        <CircularProgress color="primary" />
        <Typography mt={2} variant="h6" color="text.secondary">
          Cargando ciudad...
        </Typography>
      </Box>
    );

  const detalles = [
    { icon: <BadgeIcon color="primary" sx={{ fontSize: 28 }} />, label: "ID Ciudad:", value: ciudad.IdCiudad },
    { icon: <LocationCityIcon color="primary" sx={{ fontSize: 28 }} />, label: "Nombre:", value: ciudad.Nombre },
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
        onClick={() => navigate("/ciudades")}
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
        Detalle de la Ciudad
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

export default CiudadDetalle;
