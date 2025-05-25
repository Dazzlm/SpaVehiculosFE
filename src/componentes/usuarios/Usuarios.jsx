import React from 'react';
import GroupIcon from '@mui/icons-material/Group';
import { Typography, Box, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Usuarios() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
        <GroupIcon fontSize="large" />
        Usuarios
      </Typography>

      <Stack direction="row" spacing={4} justifyContent="center" mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/usuarios/cliente')}
          size="large"
        >
          Ir a Clientes
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate('/usuarios/administradores')}
          size="large"
        >
          Ir a Administradores
        </Button>
      </Stack>
    </Box>
  );
}
