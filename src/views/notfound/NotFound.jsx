import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Stack
} from '@mui/material';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import { useSpaVehiculosStore } from '../../zustand/SpaVehiculosStore.js';

const NotFound = () => {
  const navigate = useNavigate();
  const { currentUser,loadCurrentUser } = useSpaVehiculosStore();
  useEffect(() => {
    loadCurrentUser();
    const timeout = setTimeout(() => {
      navigate(currentUser ? '/' : '/login');
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-dark-blue)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="md">
        <Stack
          spacing={4}
          alignItems="center"
          justifyContent="center"
          textAlign="center"
        >
          <ReportProblemRoundedIcon sx={{ fontSize: 100, color: 'var(--color-red-oxide)' }} />
          <Typography variant="h1" sx={{ color: 'var(--color-metal-gray)', fontWeight: 'var(--font-extrabold)', fontSize: '4rem' }}>
            404
          </Typography>
          <Typography variant="h5" sx={{ color: 'var(--color-smoke-white)', fontWeight: 'var(--font-medium)' }}>
            Página no encontrada
          </Typography>
          <Typography variant="body1" sx={{ color: 'var(--color-metal-gray)', fontWeight: 'var(--font-regular)' }}>
            Te redirigiremos automáticamente, o puedes regresar ahora mismo.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate(currentUser ? '/' : '/login')}
            sx={{
              mt: 2,
              px: 5,
              py: 1.5,
              fontWeight: 'var(--font-semibold)',
              fontSize: '1rem',
              borderRadius: '8px',
              backgroundColor: 'var(--color-red-oxide)',
              color: 'white',
              '&:hover': {
                backgroundColor: '#922509',
              },
            }}
          >
            Volver al inicio
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default NotFound;


