export async function getSedes() {
  try {
    const user = JSON.parse(localStorage.getItem("CurrentUser"));

    const response = await fetch('http://spavehiculos.runasp.net/api/Sedes/ConsultarTodos', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        error: true,
        message: result.message || "Error fetching data"
      };
    }

    return result;
  } catch (errors) {
    console.error("Error fetching data:", errors.message);
    return {
      error: true,
      message: errors.message || "Error desconocido"
    };
  }
}
