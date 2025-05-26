import React, { useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  Paper,
  Stack,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { useNavigate } from 'react-router-dom';

export default function DescargarImagen() {
  const [nombreArchivo, setNombreArchivo] = useState("");
  const navigate = useNavigate();

  const descargar = async () => {
    if (!nombreArchivo) {
      alert("Por favor, ingresa el nombre del archivo");
      return;
    }

    try {
      const response = await fetch(
        `https://localhost:44376/api/UploadCliente/Descargar?nombreArchivo=${encodeURIComponent(
          nombreArchivo
        )}`
      );

      if (!response.ok) {
        alert("Error al descargar el archivo");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = nombreArchivo;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 8, px: 3 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          textAlign="center"
        >
          Descargar Imagen
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3} textAlign="center">
          Ingresa el nombre exacto del archivo que deseas descargar (ej: <em>imagen.png</em>)
        </Typography>

        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Nombre del archivo"
            variant="outlined"
            value={nombreArchivo}
            onChange={(e) => setNombreArchivo(e.target.value)}
          />

          <Button
            variant="contained"
            color="success"
            size="large"
            startIcon={<DownloadIcon />}
            onClick={descargar}
            disabled={!nombreArchivo.trim()}
          >
            Descargar
          </Button>

          <Button
            variant="text"
            color="secondary"
            onClick={() => navigate('/imagen')}
          >
            Regresar
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
