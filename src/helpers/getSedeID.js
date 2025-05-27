export async function getSedeID(idSede) {
    try {
        const response = await fetch(`http://spavehiculos.runasp.net/api/Sedes/ConsultarXId?IdSede=${idSede}`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Error al obtener el sede con ID " + idSede);
        }

        return result;
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}