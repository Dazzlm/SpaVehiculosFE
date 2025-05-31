import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReceiptIcon from "@mui/icons-material/Receipt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DownloadIcon from "@mui/icons-material/Download";
import { getFacturas } from "../../helpers/Facturas/getFacturas"; // Asegúrate de tener esta función para obtener las facturas
import { getFacturaPDF } from "../../helpers/Facturas/getFacturaPDF";

const ListaFacturas = () => {
  const [facturas, setFacturas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const result = await getFacturas();

      if (result === undefined || result === null) {
        setFacturas([]);
        console.error("Error fetching data");
        return;
      }
      setFacturas(result);
    };
    fetchData();
  }, []);

  const verPDF = async (idFactura) => {
    try {
      const url = await getFacturaPDF(idFactura);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error al mostrar el PDF:", error);
      alert("No se pudo mostrar el PDF.");
    }
  };

  const descargarPDF = async (idFactura) => {
    try {
      const url = await getFacturaPDF(idFactura);

      const link = document.createElement("a");
      link.href = url;
      link.download = `Factura_${idFactura}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error al descargar el PDF:", error);
      alert("No se pudo descargar el PDF.");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1200px",
        mx: "auto",
        py: 3,
        px: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        mb={3}
      >
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/facturacion")}>    
        
          Regresar
        </Button>

        <Stack direction="row" alignItems="center" spacing={1}>
          <ReceiptIcon sx={{ fontSize: 36, color: "#444" }} />
          <Typography variant="h5" fontWeight="bold">
            Lista de Facturas
          </Typography>
        </Stack>
      </Stack>

      <Box sx={{ overflowX: "auto" }}>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            minWidth: 800,
            maxHeight: 700,
            overflowY: "auto",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>ID Factura</b>
                </TableCell>
                <TableCell>
                  <b>Fecha</b>
                </TableCell>
                <TableCell>
                  <b>ID Cliente</b>
                </TableCell>
                <TableCell>
                  <b>Total</b>
                </TableCell>
                <TableCell>
                  <b>ID Sede</b>
                </TableCell>
                <TableCell align="center">
                  <b>Acciones</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {facturas.length > 0 ? (
                facturas.map((factura) => (
                  <TableRow key={factura.IdFactura} hover>
                    <TableCell>{factura.IdFactura}</TableCell>
                    <TableCell>
                      {new Date(factura.Fecha).toLocaleString()}
                    </TableCell>
                    <TableCell>{factura.IdCliente}</TableCell>
                    <TableCell>${factura.Total.toLocaleString()}</TableCell>
                    <TableCell>{factura.IdSede}</TableCell>
                    <TableCell align="center">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <IconButton
                          color="primary"
                          onClick={() =>
                            navigate(`/facturas/ver/${factura.IdFactura}`)
                          }
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => verPDF(factura.IdFactura)}
                        >
                          <PictureAsPdfIcon />
                        </IconButton>
                        <IconButton
                          color="success"
                          onClick={() => descargarPDF(factura.IdFactura)}
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{ py: 4, color: "gray" }}
                  >
                    No hay facturas registradas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ListaFacturas;
