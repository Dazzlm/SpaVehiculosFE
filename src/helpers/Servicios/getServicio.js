
export async function getServicio() {
  try {
    const response = await fetch(`http://spavehiculos.runasp.net/api/Servicios/ConsultarTodos`);
    const result = await response.json();

    console.log("Respuesta completa del backend:", result);

    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor");
    }

    if (!Array.isArray(result)) {
      throw new Error("El backend no devolvió un arreglo");
    }

    return result;
  } catch (error) {
    console.error("Error al obtener servicios:", error.message);
    return [];
  }
}
