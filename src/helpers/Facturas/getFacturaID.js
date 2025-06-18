export async function getFacturaID(idFactura) {
  try {
    const user = JSON.parse(localStorage.getItem("CurrentUser")); 

    const response = await fetch(
      `https://spavehiculos.runasp.net/api/Facturas/ConsultarFacturaXId?id=${idFactura}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`, // Agrega el token en el header
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error al obtener el detalle de la factura con ID " + idFactura);
    }

    return result.Data;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
