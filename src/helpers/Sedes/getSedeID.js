export async function getSedeID(idSede) {
  try {
    const user = JSON.parse(localStorage.getItem("CurrentUser"));

    const response = await fetch(`https://spavehiculos.runasp.net/api/Sedes/ConsultarXId?IdSede=${idSede}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error al obtener la sede con ID " + idSede);
    }

    return result;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}
