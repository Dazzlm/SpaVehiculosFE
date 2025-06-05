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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BadgeIcon from "@mui/icons-material/Badge";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

function ProveedorDetalle() {
  const { id } = useParams();
  const [proveedor, setProveedor] = useState(null);
  const navigate = useNavigate();
  const imagenPorDefecto = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("CurrentUser"));

fetch(`https://spavehiculos.runasp.net/api/GestorProv/ConsultarporID?idProveedor=${id}`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user?.token}`,
  },
})
  .then((res) => res.json())
  .then((data) => {
    setProveedor(data);
  })
  .catch((err) => console.error("Error al cargar proveedor", err));

  }, [id]);

  if (!proveedor)
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
        <CircularProgress color="primary" />
        <Typography mt={2} variant="h6" color="text.secondary">
          Cargando proveedor...
        </Typography>
      </Box>
    );

  const detalles = [
    {
      icon: <BadgeIcon color="primary" sx={{ fontSize: 28 }} />,
      label: "ID Proveedor:",
      value: proveedor.IdProveedor,
    },
    {
      icon: <BusinessIcon color="primary" sx={{ fontSize: 28 }} />,
      label: "Empresa:",
      value: proveedor.NombreEmpresa,
    },
    {
      icon: <PersonIcon color="primary" sx={{ fontSize: 28 }} />,
      label: "Contacto:",
      value: proveedor.Contacto,
    },
    {
      icon: <PhoneIcon color="primary" sx={{ fontSize: 28 }} />,
      label: "Teléfono:",
      value: proveedor.Teléfono,
    },
    {
      icon: <EmailIcon color="primary" sx={{ fontSize: 28 }} />,
      label: "Email:",
      value: proveedor.Email,
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

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/usuarios/proveedor")}
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
          src={imagenPorDefecto}
          alt="Logo/Escudo Proveedor"
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
        Detalle del Proveedor
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

export default ProveedorDetalle;
