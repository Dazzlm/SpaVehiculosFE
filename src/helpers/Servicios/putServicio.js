

export async function actualizarServicio(servicio) {
  try {
    const response = await fetch('http://spavehiculos.runasp.net/api/Servicios/ActualizarServicio', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(servicio)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar el servicio');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error actualizando servicio:', error);
    throw error;
  }
}