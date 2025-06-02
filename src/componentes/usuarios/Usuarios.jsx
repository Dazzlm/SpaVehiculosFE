import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt"; 
import SecurityIcon from "@mui/icons-material/Security";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

export default function Usuarios() {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Clientes",
      icon: <PeopleAltIcon fontSize="large" />,
      color: "#1976d2",
      path: "/usuarios/cliente",
    },
    {
      label: "Administradores",
      icon: <SecurityIcon fontSize="large" />,
      color: "#d32f2f", 
      path: "/usuarios/administradores",
    },
     {
      label: "Proveedores",
      icon: <LocalShippingIcon fontSize="large" />,
      color: "#a5bae0",
      path: "/usuarios/Proveedor",
    },
  ];

  return (
    <Box sx={{ p: 4, maxWidth: 700, mx: "auto" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          mb: 4,
        }}
      >
        <GroupIcon sx={{ fontSize: 40, color: "#333" }} />
        <Typography variant="h4" fontWeight="bold">
          Gestión de Usuarios
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {actions.map((action) => (
          <Grid item xs={12} sm={6} md={4} key={action.label}>
            <Paper
              elevation={6}
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 3,
                cursor: "pointer",
                transition: "transform 0.2s",
                minHeight: 100,
                minWidth: 120,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 10,
                },
              }}
              onClick={() => navigate(action.path)}
            >
              <Tooltip title={action.label}>
                <IconButton
                  size="large"
                  sx={{
                    backgroundColor: action.color,
                    color: "white",
                    width: 64,
                    height: 64,
                    mb: 1,
                    "&:hover": {
                      backgroundColor: action.color,
                      opacity: 0.9,
                    },
                  }}
                >
                  {action.icon}
                </IconButton>
              </Tooltip>
              <Typography variant="subtitle1" fontWeight={600}>
                {action.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
