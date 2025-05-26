import { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  InputLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ActualizarImagenCliente = () => {
  const [idCliente, setIdCliente] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleArchivoChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idCliente || !archivo) {
      setError('Por favor, ingresa un ID y selecciona una imagen.');
      setMensaje('');
      return;
    }

    const formData = new FormData();
    formData.append('idCliente', idCliente);
    formData.append('archivo', archivo);

    try {
      const response = await fetch('https://localhost:44376/api/UploadCliente/Actualizar', {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al actualizar la imagen.');
      }

      setMensaje('Imagen actualizada correctamente.');
      setError('');

      setTimeout(() => {
        navigate('/imagen');
      }, 1500);
    } catch (error) {
      setError(`Error: ${error.message}`);
      setMensaje('');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Typography variant="h5" gutterBottom align="center" color="primary">
        Actualizar Imagen del Cliente
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
      >
        <TextField
          label="ID del Cliente"
          type="number"
          value={idCliente}
          onChange={(e) => setIdCliente(e.target.value)}
          required
        />

        <div>
          <InputLabel htmlFor="archivo">Seleccionar Imagen</InputLabel>
          <input
            id="archivo"
            type="file"
            accept="image/*"
            onChange={handleArchivoChange}
            required
            style={{ marginTop: 8 }}
          />
        </div>

        <Button type="submit" variant="contained" color="primary">
          Actualizar Imagen
        </Button>

        {mensaje && <Alert severity="success">{mensaje}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}

        <Button
          variant="text"
          color="secondary"
          onClick={() => navigate('/imagen')}
        >
          Regresar
        </Button>
      </Box>
    </Container>
  );
};

export default ActualizarImagenCliente;
