export async function getServicios() {
    try {
        const response = await fetch(`http://spavehiculos.runasp.net/api/Servicios/ConsultarTodos`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Error al obtener servicios");
        }

        return result;
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}

    