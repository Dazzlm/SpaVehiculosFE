import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  Divider,
  Modal,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { getFacturaID } from "../../helpers/Facturas/getFacturaID";
import { getFacturaPDF } from "../../helpers/Facturas/getFacturaPDF";
import { getProductos } from "../../helpers/Productos/getProductos";
import { getServicios } from "../../helpers/Servicios/getServicios";
import { getClienteID } from "../../helpers/Clientes/getClienteID";
import { getSedeID } from "../../helpers/Sedes/getSedeID";
import { filtrarProductosPorIds } from "../../helpers/filtrarIds";
import { filtrarServiciosPorIds } from "../../helpers/filtrarIds";

export default function FacturaDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [facturaDetalle, setFacturaDetalle] = useState(undefined);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [productos, setProductos] = useState(undefined);
  const [servicios, setServicios] = useState(undefined);
  const [sede, setSede] = useState(undefined);
  const [cliente, setCliente] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getFacturaID(id);
        if (!result) {
          setFacturaDetalle(null);
          console.error("Error fetching data");
          setLoading(false);
          return;
        }
        if (result.length === 0) {
          setFacturaDetalle(null);
          console.error("No se encontró la factura con ID:", id);
          setLoading(false);
          return;
        }

        setFacturaDetalle(result);

        const pdf = await getFacturaPDF(id);
        setPdfUrl(pdf);

        const productosData = await getProductos();

        setProductos(filtrarProductosPorIds(result.Productos, productosData));

        const serviciosData = await getServicios();
        setServicios(filtrarServiciosPorIds(result.Servicios, serviciosData));

        const clienteData = await getClienteID(result.Factura.IdCliente);
        setCliente(clienteData);

        const sedeData = await getSedeID(result.Factura.IdSede);
        setSede(sedeData);
      } catch (error) {
        console.error("Error fetching factura o PDF:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading)
    return (
      <Box
        sx={{
          width: "100%",
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (!facturaDetalle)
    return <Typography>No se encontró la factura.</Typography>;

  const { Factura } = facturaDetalle;

  const descargarPDF = async () => {
    try {
      const url = await getFacturaPDF(id);

      const a = document.createElement("a");
      a.href = url;
      a.download = `Factura_${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error descargando el PDF:", error);
      alert("No se pudo descargar el PDF.");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1000px",
        mx: "auto",
        py: 3,
        px: { xs: 1, sm: 2, md: 3 },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/facturacion")}
          >
            Regresar
          </Button>

          <Button
            variant="contained"
            color="info"
            onClick={() => setModalOpen(true)} // abrir modal con PDF
          >
            Ver PDF
          </Button>

          <Button variant="contained" color="success" onClick={descargarPDF}>
            Descargar PDF
          </Button>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center">
          <ReceiptIcon sx={{ fontSize: 36, color: "#444" }} />
          <Typography variant="h5" fontWeight="bold">
            Detalle de Factura #{Factura.IdFactura}
          </Typography>
        </Stack>
      </Stack>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1">
          <b>Fecha:</b> {new Date(Factura.Fecha).toLocaleString()}
        </Typography>
        <Typography variant="subtitle1">
          <b>Cliente:</b> {cliente.Nombre} {cliente.Apellidos}
        </Typography>
        <Typography variant="subtitle1">
          <b>Sede:</b> {sede.Nombre}
        </Typography>
        <Typography variant="subtitle1">
          <b>Total:</b> ${Factura.Total.toLocaleString()}
        </Typography>
      </Paper>

      <Divider sx={{ my: 3 }} />

      {productos.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            Productos
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>ID Producto</b>
                  </TableCell>
                  <TableCell>
                    <b>Nombre</b>
                  </TableCell>
                  <TableCell>
                    <b>Cantidad</b>
                  </TableCell>
                  <TableCell>
                    <b>Subtotal</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productos.map((prod) => (
                  <TableRow key={prod.IdDetalle}>
                    <TableCell>{prod.IdProducto}</TableCell>
                    <TableCell>{prod.Nombre}</TableCell>
                    <TableCell>{prod.Cantidad}</TableCell>
                    <TableCell>${prod.Subtotal.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {servicios.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            Servicios
          </Typography>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>ID Servicio</b>
                  </TableCell>
                  <TableCell>
                    <b>Nombre</b>
                  </TableCell>
                  <TableCell>
                    <b>Subtotal</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {servicios.map((serv) => (
                  <TableRow key={serv.IdServicio}>
                    <TableCell>{serv.IdServicio}</TableCell>
                    <TableCell>{serv.Nombre}</TableCell>
                    <TableCell>${serv.Subtotal.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Modal para mostrar PDF */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-pdf-title"
        aria-describedby="modal-pdf-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "900px",
            height: "80vh",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            borderRadius: 2,
          }}
        >
          <Typography id="modal-pdf-title" variant="h6" mb={1}>
            Vista previa del PDF
          </Typography>
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              title="Vista previa PDF"
              width="100%"
              height="85%"
              style={{ border: "none", borderRadius: "8px" }}
            />
          ) : (
            <Typography>Cargando PDF...</Typography>
          )}
          <Box textAlign="right" mt={1}>
            <Button variant="outlined" onClick={() => setModalOpen(false)}>
              Cerrar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
