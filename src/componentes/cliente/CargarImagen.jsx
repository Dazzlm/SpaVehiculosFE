import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
} from '@mui/material';

export default function UploadImage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [idCliente, setIdCliente] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !idCliente.trim()) {
      setError(true);
      setMensaje('Selecciona un archivo y escribe un ID de cliente.');
      return;
    }

    setError(false);
    setMensaje('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('idCliente', idCliente);

    try {
      const response = await fetch('https://localhost:44376/api/UploadCliente/Subir', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        setError(true);
        setMensaje(`Error: ${errorText}`);
        return;
      }

      const data = await response.text();
      setError(false);
      setMensaje(`Archivo subido correctamente: ${data}`);

      setTimeout(() => {
        navigate("/imagen");
      }, 1500);

    } catch (error) {
      setError(true);
      setMensaje(`Error de red: ${error.message}`);
    }
  };

  return (
    <Box
      maxWidth={400}
      mx="auto"
      mt={6}
      p={4}
      bgcolor="background.paper"
      borderRadius={2}
      boxShadow={3}
    >
      <Typography variant="h5" mb={3} color="primary.main" fontWeight="700" textAlign="center">
        Subir imagen de cliente
      </Typography>

      <Stack spacing={3}>
        <Button
          variant="outlined"
          component="label"
        >
          Seleccionar archivo
          <input
            type="file"
            hidden
            onChange={handleFileChange}
            accept="image/*"
          />
        </Button>
        {file && (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Archivo seleccionado: {file.name}
          </Typography>
        )}

        <TextField
          label="ID Cliente"
          variant="outlined"
          value={idCliente}
          onChange={(e) => setIdCliente(e.target.value)}
          fullWidth
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!file || !idCliente.trim()}
          fullWidth
        >
          Subir
        </Button>

        {mensaje && (
          <Alert severity={error ? 'error' : 'success'}>
            {mensaje}
          </Alert>
        )}

        <Button
          variant="text"
          color="secondary"
          onClick={() => navigate("/imagen")}
          fullWidth
        >
          Regresar
        </Button>
      </Stack>
    </Box>
  );
}
