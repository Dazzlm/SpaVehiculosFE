import React, { useState } from "react";
import { Button, TextField, Typography, Box, Alert, Stack } from "@mui/material";
import { useNavigate } from 'react-router-dom';

function EliminarImagen() {
  const navigate = useNavigate();
  const [idCliente, setIdCliente] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);

  const handleEliminar = async () => {
    if (!idCliente.trim()) {
      setError(true);
      setMensaje("Por favor ingresa el ID del cliente");
      return;
    }

    setError(false);
    setMensaje("");

    try {
      const response = await fetch(
        `https://localhost:44376/api/UploadCliente/EliminarPorCliente?idCliente=${idCliente}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        setError(true);
        setMensaje(`Error al eliminar la imagen: ${errorText}`);
        return;
      }

      const data = await response.text(); 
      setError(false);
      setMensaje(`Imagen eliminada correctamente: ${data}`);

      setTimeout(() => {
        navigate('/imagen');
      }, 1500);
    } catch (error) {
      setError(true);
      setMensaje(`Error al eliminar la imagen: ${error.message}`);
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
        Eliminar Imagen por ID Cliente
      </Typography>

      <Stack spacing={3}>
        <TextField
          label="ID Cliente"
          variant="outlined"
          fullWidth
          value={idCliente}
          onChange={(e) => setIdCliente(e.target.value)}
          type="number"
        />

        <Button 
          variant="contained" 
          color="error" 
          fullWidth 
          onClick={handleEliminar}
          disabled={!idCliente.trim()}
        >
          Eliminar Imagen
        </Button>

        {mensaje && (
          <Alert severity={error ? "error" : "success"}>
            {mensaje}
          </Alert>
        )}

        <Button
          variant="text"
          color="secondary"
          onClick={() => navigate('/imagen')}
        >
          Regresar
        </Button>
      </Stack>
    </Box>
  );
}

export default EliminarImagen;
