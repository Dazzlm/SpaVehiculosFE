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

const MAX_FILE_SIZE_MB = 2;

const ActualizarImagenCliente = () => {
  const [idCliente, setIdCliente] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleArchivoChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const validarFormulario = () => {
    if (!idCliente) {
      setError('El ID del cliente es obligatorio.');
      return false;
    }

    const idNum = Number(idCliente);
    if (!Number.isInteger(idNum) || idNum <= 0) {
      setError('El ID del cliente debe ser un número entero positivo.');
      return false;
    }

    if (!archivo) {
      setError('Debes seleccionar una imagen.');
      return false;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(archivo.type)) {
      setError('El archivo debe ser una imagen JPG o PNG');
      return false;
    }

    const maxSizeBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
    if (archivo.size > maxSizeBytes) {
      setError(`La imagen no puede superar los ${MAX_FILE_SIZE_MB} MB.`);
      return false;
    }

    setError('');
    return true;
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validarFormulario()) {
    setMensaje('');
    return;
  }

  const storedUser = JSON.parse(localStorage.getItem("CurrentUser"));
  const token = storedUser?.token;

  if (!token) {
    setError('No autorizado. Por favor inicia sesión.');
    setMensaje('');
    navigate('/login');
    return;
  }

  const formData = new FormData();
  formData.append('idCliente', idCliente);
  formData.append('archivo', archivo);

  try {
    const response = await fetch('https://spavehiculos.runasp.net/api/UploadCliente/Actualizar', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`, // <-- token aquí
      },
      body: formData,
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
          inputProps={{ min: 1, step: 1 }}
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

        <Button variant="text" color="secondary" onClick={() => navigate('/imagen')}>
          Regresar
        </Button>
      </Box>
    </Container>
  );
};

export default ActualizarImagenCliente;
