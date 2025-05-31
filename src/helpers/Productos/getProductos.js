export async function getProductos() {
  try {
    const user = JSON.parse(localStorage.getItem("CurrentUser")); // Obtener el token

    const response = await fetch(`http://spavehiculos.runasp.net/api/Productos/ObtenerTodos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`, // Agregar el token en el header
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error al obtener productos");
    }

    return result.data;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
