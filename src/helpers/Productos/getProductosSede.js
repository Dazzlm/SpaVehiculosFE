export async function getProductosSede(idSede) {
  try {
    const user = JSON.parse(localStorage.getItem("CurrentUser")); // Obtener token

    const response = await fetch(`http://spavehiculos.runasp.net/api/Productos/ObtenerConStockPorSede?idSede=${idSede}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`, // Incluir token
      },
    });

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

    