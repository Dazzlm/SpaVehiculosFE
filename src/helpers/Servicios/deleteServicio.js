

export async function eliminarServicio(idServicio) {
  try {
    const response = await fetch(`http://spavehiculos.runasp.net/api/Servicios/EliminarServicio?idServicio=${idServicio}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al eliminar el servicio');
    }

    return true; // Indica que la eliminación fue exitosa
  } catch (error) {
    console.error('Error eliminando servicio:', error);
    throw error; // Propaga el error para manejarlo en el componente
  }
}
