import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSpaVehiculosStore } from "../../zustand/SpaVehiculosStore";

export default function Inicio() {
  const [totalClientes, setTotalClientes] = useState(null);
  const [error, setError] = useState(null);
  const { currentUser } = useSpaVehiculosStore();

  useEffect(() => {
    const fetchCount = async () => {
      try {
        // Obtiene token del estado global o localStorage
        const storedUser = JSON.parse(localStorage.getItem("CurrentUser"));
        const token = currentUser?.token || storedUser?.token;

        if (!token) {
          setError("No autorizado: no se encontró token.");
          return;
        }

        const response = await axios.get(
          "http://spavehiculos.runasp.net/api/Clientes/Contar",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setTotalClientes(response.data);
      } catch (err) {
        setError("Error al obtener el conteo de clientes");
        console.error(err);
      }
    };

    fetchCount();
  }, [currentUser]);

  return (
    <>
      <h1>Bienvenidos</h1>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          maxWidth: "300px",
          backgroundColor: "#fff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h2>Clientes Registrados</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {totalClientes === null && !error ? (
          <p>Cargando...</p>
        ) : (
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#d32f2f" }}>
            {totalClientes}
          </p>
        )}
      </div>
    </>
  );
}
