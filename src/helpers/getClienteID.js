export async function getClienteID(IdCliente) {
    try {
        const response = await fetch(`http://spavehiculos.runasp.net/api/Clientes/ConsultarXId?IdCliente=${IdCliente}`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Error al obtener el cliente con ID " + IdCliente);
        }

        return result;
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}