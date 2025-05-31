import axios from "axios";

const API_BASE_URL = "http://spavehiculos.runasp.net/api";

export const eliminarReserva = async (idReserva) => {
  try {
    const endpoint = `${API_BASE_URL}/Reservas/EliminarReserva?idReserva=${idReserva}`;
    
    console.log("URL de eliminación de reserva:", endpoint); 

    const response = await axios.delete(endpoint);
    
   
    return response.data; 
  } catch (error) {
    console.error(`Error al eliminar la reserva con ID ${idReserva}:`, error);
   
    if (error.response && error.response.data && error.response.data.Message) {
      throw new Error(error.response.data.Message);
    } else {
      throw error;
    }
  }
};