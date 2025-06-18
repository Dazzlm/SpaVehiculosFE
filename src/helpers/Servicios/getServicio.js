export async function getServicio() {
  try {
    const user = JSON.parse(localStorage.getItem("CurrentUser"));
    if (!user?.token) {
      throw new Error("No estás autenticado.");
    }

    const response = await fetch(`https://spavehiculos.runasp.net/api/Servicios/ConsultarTodos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      },
    });

    const result = await response.json();

    console.log("Respuesta completa del backend:", result);

    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor");
    }

    if (!Array.isArray(result)) {
      throw new Error("El backend no devolvió un arreglo");
    }

    return result.data;
  } catch (error) {
    console.error("Error al obtener servicios:", error.message);
    return [];
  }
}
