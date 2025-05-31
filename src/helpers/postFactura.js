
export const postFactura = async (facturaPayload) => {
  try {
        const response = await fetch("http://spavehiculos.runasp.net/api/Facturas/crear", {
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

        const result = await response.json();
        console.log("Factura creada con éxito:", result);
      
        return result; 
    } catch (error) {
      console.error("Error generando la factura:", error);
   
  }
};
