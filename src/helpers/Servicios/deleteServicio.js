export async function eliminarServicio(idServicio) {
  try {
    const user = JSON.parse(localStorage.getItem("CurrentUser"));
    if (!user?.token) {
      throw new Error("No estás autenticado.");
    }

    const response = await fetch(`http://spavehiculos.runasp.net/api/Servicios/EliminarServicio?idServicio=${idServicio}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al eliminar el servicio');
    }

    return true; 
  } catch (error) {
    console.error('Error eliminando servicio:', error);
    throw error; 
  }
}
