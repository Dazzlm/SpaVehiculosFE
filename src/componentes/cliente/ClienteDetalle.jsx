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
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import FingerprintIcon from '@mui/icons-material/Fingerprint';

function ClienteDetalle() {
  const { id } = useParams();
  const [clienteUsuario, setClienteUsuario] = useState(null);
  const [imagenUrl, setImagenUrl] = useState(null);
  const navigate = useNavigate();

  const imagenPorDefecto = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("CurrentUser"));
    const token = storedUser?.token;

    if (!token) {
      console.warn("No se encontró token, redirigiendo al login...");
      navigate("/login");
      return;
    }

    const baseUrl = 'https://spavehiculos.runasp.net/api/Clientes';

    fetch(`${baseUrl}/ConsultarClienteUsuario?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setClienteUsuario(data.Data);

        const imagenClienteUrl = `https://spavehiculos.runasp.net/api/UploadCliente/ImagenCliente?idCliente=${id}`;
        fetch(imagenClienteUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(response => {
            if (!response.ok) throw new Error("No se pudo cargar la imagen");
            return response.blob();
          })
          .then(blob => {
            const imageObjectUrl = URL.createObjectURL(blob);
            setImagenUrl(imageObjectUrl);
          })
          .catch(() => {
            setImagenUrl(imagenPorDefecto);
          });
      })
      .catch(err => {
        console.error("Error al cargar cliente:", err.message);
        setClienteUsuario(null);
        setImagenUrl(imagenPorDefecto);
      });

    return () => {
      if (imagenUrl && imagenUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imagenUrl);
      }
    };
  }, [id, navigate]);

  if (!clienteUsuario)
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
        <CircularProgress color="primary" />
        <Typography mt={2} variant="h6" color="text.secondary">
          Cargando cliente...
        </Typography>
      </Box>
    );

  const detalles = [
    { icon: <BadgeIcon color="primary" sx={{ fontSize: 28 }} />, label: "ID Cliente:", value: clienteUsuario.IdCliente },
    { icon: <PersonIcon color="primary" sx={{ fontSize: 28 }} />, label: "Nombre:", value: clienteUsuario.Nombre },
    { icon: <PersonIcon color="primary" sx={{ fontSize: 28 }} />, label: "Apellidos:", value: clienteUsuario.Apellidos },
    { icon: <FingerprintIcon color="primary" sx={{ fontSize: 28 }} />, label: "Documento:", value: clienteUsuario.DocumentoUsuario },
    { icon: <AccountBoxIcon color="primary" sx={{ fontSize: 28 }} />, label: "Nombre Usuario:", value: clienteUsuario.NombreUsuario },
    { icon: <EmailIcon color="primary" sx={{ fontSize: 28 }} />, label: "Email:", value: clienteUsuario.Email },
    { icon: <PhoneIcon color="primary" sx={{ fontSize: 28 }} />, label: "Teléfono:", value: clienteUsuario.Telefono },
    { icon: <HomeIcon color="primary" sx={{ fontSize: 28 }} />, label: "Dirección:", value: clienteUsuario.Direccion },
  ];

  return (
    <Box
      maxWidth={600}
      maxHeight="70vh"
      overflow="auto"
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
                <Typography fontWeight={700} sx={{ minWidth: 150, color: "text.secondary" }}>
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
