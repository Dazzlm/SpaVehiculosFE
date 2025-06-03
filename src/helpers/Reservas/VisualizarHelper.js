import axios from "axios";

const API_BASE = "http://spavehiculos.runasp.net/api";

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

export const obtenerClientes = async () => {
  const response = await axios.get(`${API_BASE}/Clientes/ConsultarTodos`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const obtenerServicios = async () => {
  const response = await axios.get(`${API_BASE}/Servicios/ConsultarTodos`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const obtenerSedes = async () => {
  const response = await axios.get(`${API_BASE}/Sedes/ConsultarTodos`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const crearReserva = async (reserva) => {
  const response = await axios.post(`${API_BASE}/Reservas/CrearReserva`, reserva, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const obtenerTodasLasReservas = async () => {
  try {
    const response = await axios.get(`${API_BASE}/Reservas/ConsultarTodos`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener todas las reservas:", error);
    throw error;
  }
};
