
export const getFacturaPDF = async (idFactura) => {
  try {
    const response = await fetch(`http://spavehiculos.runasp.net/api/GestorPDF/descargar?id=${idFactura}`, {
      method: "GET",
      headers: {
        Accept: "application/pdf",
      },
    });

    if (!response.ok) throw new Error("No se pudo obtener el PDF");

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    return url; 
  } catch (error) {
    console.error("Error al mostrar PDF:", error);
    return null;
  }
};
