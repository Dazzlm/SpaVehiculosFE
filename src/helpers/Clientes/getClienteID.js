export async function getClienteID(IdCliente) {
  try {
    const user = JSON.parse(localStorage.getItem("CurrentUser"));
    if (!user?.token) {
      throw new Error("No estás autenticado.");
    }

    const response = await fetch(
      `https://spavehiculos.runasp.net/api/Clientes/ConsultarXId?IdCliente=${IdCliente}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error al obtener el cliente con ID " + IdCliente);
    }

    return result.Data;
  } catch (error) {
    console.error("Error:", error);
    return null; // mejor devolver null cuando hay error o no autenticación
  }
}
