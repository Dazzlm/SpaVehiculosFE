import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import PhotoIcon from '@mui/icons-material/Photo';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

export default function Facturacion() {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Registrar factura',
      icon: <PointOfSaleIcon fontSize="large" />,
      color: 'primary.main',
      path: '/facturacion/registrar',
    },
    {
      label: 'Lista de Facturas',
      icon: <ReceiptLongIcon fontSize="large" />,
      color: 'success.main',
      path: '/facturacion/lista',
    },
    
    
  ];

  return (
    <Box sx={{ p: 4, maxWidth: 900, mx: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          mb: 4,
        }}
      >
        <PhotoIcon sx={{ fontSize: 40 }} />
        <Typography variant="h4" fontWeight="bold">
          Gestión Facturas
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 3,
        }}
      >
        {actions.map((action) => (
          <Paper
            key={action.label}
            elevation={6}
            sx={{
              p: 3,
              textAlign: 'center',
              borderRadius: 3,
              width: 150,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.03)',
                boxShadow: 8,
              },
              cursor: 'pointer',
            }}
            onClick={() => navigate(action.path)}
          >
            <Tooltip title={action.label}>
              <IconButton
                sx={{
                  backgroundColor: action.color,
                  color: 'white',
                  mb: 1,
                  '&:hover': {
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
        ))}
      </Box>
    </Box>
  );
}
