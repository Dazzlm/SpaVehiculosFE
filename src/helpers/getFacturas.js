

export async function getFacturas() {
    try {
        const response = await fetch(`http://spavehiculos.runasp.net/api/Facturas/ConsultarFacturas`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Error al obtener la lista de facturas ");
        }

        return result.data;
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}