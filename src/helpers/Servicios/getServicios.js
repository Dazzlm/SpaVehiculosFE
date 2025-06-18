export async function getServicios() {
  try {
    const user = JSON.parse(localStorage.getItem("CurrentUser"));
    
    if (!user?.token) {
      throw new Error("No estás autenticado.");
    }

    const response = await fetch(`https://spavehiculos.runasp.net/api/Servicios/ConsultarTodos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error al obtener servicios");
    }

    return result.Data;
  } catch (error) {
    console.error("Error al obtener servicios:", error.message);
    return [];
  }
}
