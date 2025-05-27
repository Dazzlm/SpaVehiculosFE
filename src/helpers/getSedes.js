
export async function getSedes() {

    try {
        const response = await fetch('http://spavehiculos.runasp.net/api/Sedes/ConsultarTodos');
        const result = await response.json();

        if (!response.ok) {
            return {
                error: true,
                message: result.message || "Error fetching data"
            };
        }

        return result;
    }catch (errors) {
        console.error("Error fetching data:", errors.message);
    } 
}
    
    