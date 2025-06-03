import axios from "axios";

const API_BASE_URL = "http://spavehiculos.runasp.net/api";

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("CurrentUser"));
  if (!user?.token) {
    throw new Error("No estás autenticado.");
  }
  return {
    Authorization: `Bearer ${user.token}`,
    "Content-Type": "application/json",
  };
};

export const actualizarReserva = async (reservaData) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/Reservas/ActualizarReserva`,
      reservaData,
      { headers: getAuthHeaders() }
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
    const response = await axios.get(endpoint, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(`Error al consultar la reserva con ID ${idReserva}:`, error);
    throw error;
  }
};

export const consultarClientes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Clientes/ConsultarTodos`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al cargar clientes:", error);
    throw error;
  }
};

export const consultarServicios = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Servicios/ConsultarTodos`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al cargar servicios:", error);
    throw error;
  }
};

export const consultarSedes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/Sedes/ConsultarTodos`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al cargar sedes:", error);
    throw error;
  }
};
