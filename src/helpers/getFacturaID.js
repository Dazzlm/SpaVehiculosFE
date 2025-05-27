export async function getFacturaID(idFactura) {
    try {
        const response = await fetch(`http://spavehiculos.runasp.net/api/Facturas/ConsultarFacturaXId?id=${idFactura}`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Error al obtener el detalle de la factura con ID " + idFactura);
        }

        return result.data;
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}