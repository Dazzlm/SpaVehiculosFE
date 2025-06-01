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

import StorefrontIcon from "@mui/icons-material/Storefront"; 
import WarehouseIcon from "@mui/icons-material/Warehouse";   

export default function CrudProducto() {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Productos",
      icon: <StorefrontIcon fontSize="large" />, 
      color: "#1976d2", 
      path: "/gestion/productos",
    },
    {
      label: "Stock Sede",
      icon: <WarehouseIcon fontSize="large" />,
      color: "#388e3c", 
      path: "/gestion/stock",
    },
  ];

  return (
    <Box sx={{ p: 4, maxWidth: 900, mx: "auto" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          mb: 4,
        }}
      >
        <StorefrontIcon sx={{ fontSize: 40, color: "#333" }} />
        <Typography variant="h4" fontWeight="bold">
          Gestión de Productos
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {actions.map((action) => (
          <Grid item xs={12} sm={6} md={3} key={action.label}>
            <Paper
              elevation={6}
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 3,
                transition: "transform 0.2s",
                cursor: "pointer",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: 8,
                },
              }}
              onClick={() => navigate(action.path)}
            >
              <Tooltip title={action.label}>
                <IconButton
                  sx={{
                    backgroundColor: action.color,
                    color: "white",
                    mb: 1,
                    width: 64,
                    height: 64,
                    "&:hover": {
                      backgroundColor: action.color,
                      opacity: 0.9,
                    },
                  }}
                  size="large"
                >
                  {action.icon}
                </IconButton>
              </Tooltip>
              <Typography variant="subtitle1" fontWeight="500">
                {action.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
