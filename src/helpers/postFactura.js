
export const postFactura = async (facturaPayload) => {
  try {
        const response = await fetch("https://localhost:44376/api/Facturas/crear", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(facturaPayload),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Error al crear la factura: ${error}`);
        }

        const data = await response.json();
        console.log("Factura creada con éxito:", data);
      
        return true; 
    } catch (error) {
      console.error("Error generando la factura:", error);
   
  }
};
