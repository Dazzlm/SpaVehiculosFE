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
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";


function AdministradorDetalle() {
  const { id } = useParams();
  const [administrador, setAdministrador] = useState(null);
  const navigate = useNavigate();



  useEffect(() => {
   const baseUrl = 'http://spavehiculos.runasp.net/';
const user = JSON.parse(localStorage.getItem("CurrentUser"));

fetch(`${baseUrl}api/GestorAdmin/ConsultarPorID?idAdmin=${id}`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user?.token}`,
  },
})
  .then(res => res.json())
  .then(data => {
    setAdministrador(data);
  })
  .catch(err => console.error("Error al cargar administrador", err));

  }, [id]);

  if (!administrador)
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
        <CircularProgress color="primary" />
        <Typography mt={2} variant="h6" color="text.secondary">
          Cargando administrador...
        </Typography>
      </Box>
    );

  const detalles = [
  
  { icon: <BadgeIcon color="primary" sx={{ fontSize: 28 }} />, label: "ID Administrador:", value: administrador.IdAdmin },
  { icon: <PersonIcon color="primary" sx={{ fontSize: 28 }} />, label: "Nombre:", value: administrador.Nombre },
  { icon: <PersonIcon color="primary" sx={{ fontSize: 28 }} />, label: "Apellidos:", value: administrador.Apellidos },
  { icon: <EmailIcon color="primary" sx={{ fontSize: 28 }} />, label: "Email:", value: administrador.Email },
  { icon: <PhoneIcon color="primary" sx={{ fontSize: 28 }} />, label: "Teléfono:", value: administrador.Teléfono },
  { icon: <BadgeIcon color="primary" sx={{ fontSize: 28 }} />, label: "Cédula:", value: administrador.Cedula },
  { icon: <CalendarTodayIcon color="primary" sx={{ fontSize: 28 }} />, label: "Fecha de nacimiento:", value: administrador.FechaNacimiento },
  { icon: <SupervisorAccountIcon color="primary" sx={{ fontSize: 28 }} />, label: "Cargo:", value: administrador.Cargo },
  { icon: <AccountCircleIcon color="primary" sx={{ fontSize: 28 }} />, label: "ID Usuario:", value: administrador.IdUsuario },
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/usuarios/administradores")}
          sx={{
            color: "primary.main",
            borderColor: "primary.main",
            fontWeight: "bold",
            textTransform: "none",
            "&:hover": {
              bgcolor: "primary.main",
              color: "white",
              borderColor: "primary.main",
            },
          }}
        >
          Regresar
        </Button>

       
      </Box>

      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        textAlign="center"
        fontWeight="700"
        color="primary.main"
      >
        Detalle del Administrador
      </Typography>

      <Paper
        elevation={5}
        sx={{
          p: 4,
          borderRadius: 3,
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        <Stack spacing={3}>
          {detalles.map(({ icon, label, value }, i) => (
            <Box key={i}>
              <Stack direction="row" alignItems="center" spacing={2}>
                
                <Box
                  sx={{
                    minWidth: 40,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {icon}
                </Box>

               
                <Typography
                  fontWeight={700}
                  sx={{
                    width: 160,
                    color: "text.secondary",
                    flexShrink: 0,
                  }}
                >
                  {label}
                </Typography>

               
                <Typography
                  fontWeight={500}
                  color="text.primary"
                  sx={{
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                    flex: 1,
                  }}
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

export default AdministradorDetalle;