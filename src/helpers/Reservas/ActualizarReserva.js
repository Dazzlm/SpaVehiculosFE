import axios from "axios";

const API_BASE_URL = "http://spavehiculos.runasp.net/api";

export const actualizarReserva = async (reservaData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/Reservas/ActualizarReserva`,
      reservaData
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la reserva:", error);
    throw error;
  }
};

export const consultarReservaPorId = async (idReserva) => {
  try {
   
    const endpoint = `${API_BASE_URL}/Reservas/ConsultarPorID?idReserva=${idReserva}`;
    
    console.log("URL de consulta de reserva por ID:", endpoint);
    const response = await axios.get(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Error al consultar la reserva con ID ${idReserva}:`, error);
    throw error;
  }
};


export const consultarClientes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Clientes/ConsultarTodos`);
    return response.data;
  } catch (error) {
    console.error("Error al cargar clientes:", error);
    throw error;
  }
};

export const consultarServicios = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Servicios/ConsultarTodos`);
    return response.data;
  } catch (error) {
    console.error("Error al cargar servicios:", error);
    throw error;
  }
};

export const consultarSedes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Sedes/ConsultarTodos`);
    return response.data;
  } catch (error) {
    console.error("Error al cargar sedes:", error);
    throw error;
  }
};