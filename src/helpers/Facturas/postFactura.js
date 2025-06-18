export const postFactura = async (facturaPayload) => {
  try {
    const user = JSON.parse(localStorage.getItem("CurrentUser"));

    const response = await fetch("https://spavehiculos.runasp.net/api/Facturas/crear", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`, // <-- se añade el token aquí
      },
      body: JSON.stringify(facturaPayload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error al crear la factura: ${error}`);
    }

    const result = await response.json();
    console.log("Factura creada con éxito:", result);

    return result; // Retorna los datos de la factura creada
  } catch (error) {
    console.error("Error generando la factura:", error);
    return null; // opcional: retorna null si falla
  }
};

