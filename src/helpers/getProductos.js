export async function getProductos() {
    try {
        const response = await fetch(`http://spavehiculos.runasp.net/api/Productos/ObtenerTodos`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Error al obtener productos ");
        }

        return result.data;
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}

    