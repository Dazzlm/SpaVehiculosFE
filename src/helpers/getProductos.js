export async function getProductos(idSede) {
    try {
        const response = await fetch(`http://spavehiculos.runasp.net/api/Productos/ObtenerConStockPorSede?idSede=${idSede}`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Error al obtener productos con stock");
        }

        return result.data;
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}

    