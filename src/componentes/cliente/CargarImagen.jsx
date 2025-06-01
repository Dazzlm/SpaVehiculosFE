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

  const allowedExtensions = ['.jpg', '.jpeg', '.png'];
  const maxFileSize = 2 * 1024 * 1024;

  const validarIdCliente = (id) => {
    const num = Number(id);
    return Number.isInteger(num) && num > 0;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setFile(null);
      setError(false);
      setMensaje('');
      return;
    }

    const extension = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      setFile(null);
      setError(true);
      setMensaje('Extensión no permitida. Solo se permiten: .jpg, .jpeg, .png');
      return;
    }

    if (selectedFile.size > maxFileSize) {
      setFile(null);
      setError(true);
      setMensaje('El archivo excede el tamaño máximo permitido de 2 MB.');
      return;
    }

    setFile(selectedFile);
    setError(false);
    setMensaje('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError(true);
      setMensaje('Debes seleccionar un archivo.');
      return;
    }

    if (!validarIdCliente(idCliente.trim())) {
      setError(true);
      setMensaje('El ID Cliente debe ser un número entero positivo.');
      return;
    }

    setError(false);
    setMensaje('');

    const originalNameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'));
    const extension = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase();
    const newFileName = `${originalNameWithoutExt}-${idCliente.trim()}.${extension}`;

    const renamedFile = new File([file], newFileName, { type: file.type });

    const formData = new FormData();
    formData.append('file', renamedFile);
    formData.append('idCliente', idCliente.trim());

    try {
      const storedUser = JSON.parse(localStorage.getItem('CurrentUser') || 'null');
      const token = storedUser?.token;

      if (!token) {
        throw new Error("No se encontró el token de autenticación.");
      }

      const response = await fetch('http://spavehiculos.runasp.net/api/UploadCliente/Subir', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
        <Button variant="outlined" component="label">
          Seleccionar archivo
          <input
            type="file"
            hidden
            onChange={handleFileChange}
            accept=".png,.jpg,.jpeg"
          />
        </Button>

        {file && (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Archivo seleccionado: {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </Typography>
        )}

        <TextField
          label="ID Cliente"
          variant="outlined"
          value={idCliente}
          onChange={(e) => setIdCliente(e.target.value)}
          fullWidth
          helperText="Debe ser un número entero positivo"
          error={idCliente !== '' && !validarIdCliente(idCliente)}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!file || !idCliente.trim() || !validarIdCliente(idCliente)}
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
