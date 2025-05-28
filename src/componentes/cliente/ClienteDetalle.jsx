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
  Avatar,
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BadgeIcon from '@mui/icons-material/Badge';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function ClienteDetalle() {
  const { id } = useParams();
  const [cliente, setCliente] = useState(null);
  const [imagenUrl, setImagenUrl] = useState(null);
  const navigate = useNavigate();

  const imagenPorDefecto = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  useEffect(() => {
    const baseUrl = 'http://spavehiculos.runasp.net/api/Clientes';
    fetch(`${baseUrl}/ConsultarXId?idCliente=${id}`)
      .then(res => res.json())
      .then(data => {
        setCliente(data);

        const imagenClienteUrl = `http://spavehiculos.runasp.net/api/UploadCliente/ImagenCliente?idCliente=${id}`;
        fetch(imagenClienteUrl)
          .then(response => {
            if (response.ok) {
              setImagenUrl(imagenClienteUrl);
            } else {
              setImagenUrl(imagenPorDefecto);
            }
          })
          .catch(() => {
            setImagenUrl(imagenPorDefecto);
          });
      })
      .catch(err => console.error("Error al cargar cliente", err));
  }, [id]);

  if (!cliente)
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
        <CircularProgress color="primary" />
        <Typography mt={2} variant="h6" color="text.secondary">
          Cargando cliente...
        </Typography>
      </Box>
    );

  const detalles = [
    { icon: <BadgeIcon color="primary" sx={{ fontSize: 28 }} />, label: "ID Cliente:", value: cliente.IdCliente },
    { icon: <PersonIcon color="primary" sx={{ fontSize: 28 }} />, label: "Nombre:", value: cliente.Nombre },
    { icon: <PersonIcon color="primary" sx={{ fontSize: 28 }} />, label: "Apellidos:", value: cliente.Apellidos },
    { icon: <EmailIcon color="primary" sx={{ fontSize: 28 }} />, label: "Email:", value: cliente.Email },
    { icon: <PhoneIcon color="primary" sx={{ fontSize: 28 }} />, label: "Teléfono:", value: cliente.Teléfono },
    { icon: <HomeIcon color="primary" sx={{ fontSize: 28 }} />, label: "Dirección:", value: cliente.Dirección },
    { icon: <AccountCircleIcon color="primary" sx={{ fontSize: 28 }} />, label: "ID Usuario:", value: cliente.IdUsuario },
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
          onClick={() => navigate("/usuarios/cliente")}
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

        <Avatar
          src={imagenUrl || imagenPorDefecto}
          alt="Imagen del cliente"
          sx={{ width: 60, height: 60 }}
        />
      </Box>

      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        textAlign="center"
        fontWeight="700"
        color="primary.main"
      >
        Detalle del Cliente
      </Typography>

      <Paper elevation={5} sx={{ p: 4, borderRadius: 3 }}>
        <Stack spacing={3}>
          {detalles.map(({ icon, label, value }, i) => (
            <Box key={i}>
              <Stack direction="row" alignItems="center" spacing={2}>
                {icon}
                <Typography fontWeight={700} sx={{ minWidth: 130, color: "text.secondary" }}>
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

export default ClienteDetalle;
