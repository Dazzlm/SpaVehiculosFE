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
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import WorkIcon from '@mui/icons-material/Work';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';



function AdministradorDetalle() {
  const { id } = useParams();
  const [administrador, setAdministrador] = useState(null);
  const navigate = useNavigate();

  const FormatFecha =(fecha) =>{
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES')
  };

  const estado = (estadoBooleano) => estadoBooleano ? "Inactivo" : "Activo";



  useEffect(() => {
   const baseUrl = 'https://spavehiculos.runasp.net/';
const user = JSON.parse(localStorage.getItem("CurrentUser"));

fetch(`${baseUrl}api/GestorAdmin/ConsultarAdminUsuario?id=${id}`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user?.token}`,
  },
})
  .then(res => res.json())
  .then(data => {
    setAdministrador(data.Data);
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
  { icon: <PhoneIcon color="primary" sx={{ fontSize: 28 }} />, label: "Teléfono:", value: administrador.Telefono },
  { icon: <BadgeIcon color="primary" sx={{ fontSize: 28 }} />, label: "Cédula:", value: administrador.Cedula },
  { icon: <AccountBoxIcon color = "primary" x={{ fontSize: 28 }}/>, label: "Usuario", value: administrador.NombreUsuario},
  { icon: <CalendarTodayIcon color="primary" sx={{ fontSize: 28 }} />, label: "Fecha de nacimiento:", value: FormatFecha(administrador.FechaNacimiento)},
  { icon: <WorkIcon color="primary" sx={{ fontSize: 28 }} />, label: "Cargo:", value: administrador.Cargo },
  { icon: <ConnectWithoutContactIcon color ="primary" sx={{ fontSize: 28 }}/>, label: "Estado", value: estado(administrador.Estado)}

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