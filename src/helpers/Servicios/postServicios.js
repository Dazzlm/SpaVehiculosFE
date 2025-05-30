
export async function crearServicio(servicio) {
  try {
    const response = await fetch('http://spavehiculos.runasp.net/api/Servicios/CrearServicio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(servicio)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear el servicio');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creando servicio:', error);
    throw error;
  }
}