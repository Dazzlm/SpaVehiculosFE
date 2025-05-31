import axios from "axios";

const API_BASE = "http://spavehiculos.runasp.net/api";

export const obtenerClientes = async () => {
  const response = await axios.get(`${API_BASE}/Clientes/ConsultarTodos`);
  return response.data;
};

export const obtenerServicios = async () => {
  const response = await axios.get(`${API_BASE}/Servicios/ConsultarTodos`);
  return response.data;
};

export const obtenerSedes = async () => {
  const response = await axios.get(`${API_BASE}/Sedes/ConsultarTodos`);
  return response.data;
};

export const crearReserva = async (reserva) => {
  const response = await axios.post(`${API_BASE}/Reservas/CrearReserva`, reserva);
  return response.data;
};


export const obtenerTodasLasReservas = async () => {
  try {
    const response = await axios.get(`${API_BASE}/Reservas/ConsultarTodos`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener todas las reservas:", error);
    throw error; 
  }
};