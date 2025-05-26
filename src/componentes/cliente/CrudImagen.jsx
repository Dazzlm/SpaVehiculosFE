import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import PhotoIcon from '@mui/icons-material/Photo';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import UpdateIcon from '@mui/icons-material/Update';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';

export default function CrudImagen() {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Asignar Imagen',
      icon: <AddPhotoAlternateIcon fontSize="large" />,
      color: 'primary.main',
      path: '/imagen/asignar',
    },
    {
      label: 'Actualizar Imagen',
      icon: <UpdateIcon fontSize="large" />,
      color: 'secondary.main',
      path: '/imagen/actualizar',
    },
    {
      label: 'Eliminar Imagen',
      icon: <DeleteIcon fontSize="large" />,
      color: 'error.main',
      path: '/imagen/eliminar',
    },
    {
      label: 'Descargar Imagen',
      icon: <DownloadIcon fontSize="large" />,
      color: 'success.main',
      path: '/imagen/descargar',
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
          Gestión de Imágenes
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {actions.map((action) => (
          <Grid item xs={12} sm={6} md={3} key={action.label}>
            <Paper
              elevation={6}
              sx={{
                p: 3,
                textAlign: 'center',
                borderRadius: 3,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.03)',
                  boxShadow: 8,
                },
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
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
