export async function crearServicio(servicio) {
  try {
    const user = JSON.parse(localStorage.getItem("CurrentUser"));
    if (!user?.token) {
      throw new Error("No estás autenticado.");
    }

    const response = await fetch('https://spavehiculos.runasp.net/api/Servicios/CrearServicio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      },
      body: JSON.stringify(servicio),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear el servicio');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creando servicio:', error.message);
    throw error;
  }
}
