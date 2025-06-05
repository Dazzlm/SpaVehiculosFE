export const getFacturaPDF = async (idFactura) => {
  try {
    const user = JSON.parse(localStorage.getItem("CurrentUser"));

    const response = await fetch(`https://spavehiculos.runasp.net/api/GestorPDF/descargar?id=${idFactura}`, {
      method: "GET",
      headers: {
        Accept: "application/pdf",
        Authorization: `Bearer ${user.token}`, 
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


