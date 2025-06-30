import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSpring, animated } from "@react-spring/web";
import { useSpaVehiculosStore } from "../../zustand/SpaVehiculosStore";
import { useNavigate } from "react-router-dom";

const tarjetas_config = [
  {
    titulo: "Clientes Registrados",
    icono: "👤",
    gradient: "linear-gradient(135deg, #ff6b6b, #ee5a52)",
    endpoint: "Clientes/Contar",
    onClick: "/usuarios/cliente",
    dataKey: null,
  },
  {
    titulo: "Productos Registrados",
    icono: "📦",
    gradient: "linear-gradient(135deg, #4ecdc4, #44a08d)",
    endpoint: "Productos/Contar",
    onClick: "/gestion/productos",
    dataKey: "cantidad",
  },
  {
    titulo: "Reservas Hoy",
    icono: "🗓️",
    gradient: "linear-gradient(135deg, yellow, yellow)",
    endpoint: `Reservas/ContarPorFecha?fecha=${new Date().toISOString().split("T")[0]}`,
    onClick: "/reservas?filtro=today",
    dataKey: "cantidad",
  },
  {
    titulo: "Ventas Hoy",
    icono: "🧾",
    gradient: "linear-gradient(135deg, aqua, aqua)",
    endpoint: "Facturas/ConsultarFacturasHoy",
    onClick: "/facturacion/lista?filtro=today",
    dataKey: "cantidad",
  },
];

const imagenes = [
  "https://plus.unsplash.com/premium_photo-1661501041641-3e731115e687?w=500&auto=format&fit=crop&q=60",
  "https://plus.unsplash.com/premium_photo-1661495725810-0e92d20311ab?w=500&auto=format&fit=crop&q=60",
  "https://plus.unsplash.com/premium_photo-1661454209648-4764099a9be9?w=500&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1605164599901-f8a1464a2c87?w=500&auto=format&fit=crop&q=60",
];

const TarjetaEstadistica = ({ config, valor, spring }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        background: config.titulo === "Clientes Registrados" ? "white" : "rgba(255,255,255,0.95)",
        backdropFilter: config.titulo !== "Clientes Registrados" ? "blur(10px)" : "none",
        borderRadius: "16px",
        padding: "1rem",
        border: "1px solid rgba(0,0,0,0.1)",
        cursor: "pointer",
        transition: "all 0.3s ease",
        transform: isHovered ? "scale(1.03)" : "scale(1)",
        boxShadow: isHovered ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        justifyContent: "center",
        gap: "0.5rem",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(config.onClick)}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "15px",
          background: config.gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.5rem",
        }}
      >
        {config.icono}
      </div>
      <h3 style={{ margin: 0, fontSize: "1.2rem", color: "#333", fontWeight: "600" }}>
        {config.titulo}
      </h3>
      <animated.div
        style={{
          textAlign: "center",
          fontSize: "2.8rem",
          fontWeight: "700",
          background: config.gradient,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {spring.number.to((n) => Math.floor(n).toLocaleString())}
      </animated.div>
    </div>
  );
};

export default function Inicio() {
  const [datos, setDatos] = useState(Array(4).fill(0));
  const [imagenActual, setImagenActual] = useState(0);
  const { currentUser } = useSpaVehiculosStore();
  const [fechaHora, setFechaHora] = useState(new Date());

  useEffect(() => {
    const intervalo = setInterval(() => setImagenActual((prev) => (prev + 1) % imagenes.length), 4000);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setFechaHora(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("CurrentUser"));
        const token = currentUser?.token || storedUser?.token;
        const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

        const promesas = tarjetas_config.map((config) =>
          axios.get(`https://spavehiculos.runasp.net/api/${config.endpoint}`, { headers })
        );

        const resultados = await Promise.all(promesas);

        setDatos(
          resultados.map((res, index) => {
            const config = tarjetas_config[index];
            return config.dataKey ? res.data[config.dataKey] : res.data;
          })
        );
      } catch (err) {
        console.error(err);
      }
    };

    fetchDatos();
  }, [currentUser]);

  const springs = datos.map((valor) =>
    useSpring({ number: valor || 0, from: { number: 0 }, config: { duration: 2000 } })
  );

  const fadeIn = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0px)" },
    config: { duration: 800 },
  });

  const imageTransition = useSpring({
    opacity: 1,
    transform: "scale(1)",
    from: { opacity: 0, transform: "scale(1.1)" },
    reset: true,
    key: imagenActual,
    config: { duration: 1000 },
  });

  const fechaFormateada = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(fechaHora);

  const horaFormateada = fechaHora.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        overflow: "hidden",
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      <animated.div style={{ ...fadeIn }}>
        <header style={{ textAlign: "center", color: "#1e293b", marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              margin: "0 0 0.5rem 0",
              fontWeight: "700",
              letterSpacing: "-0.02em",
              background: "linear-gradient(135deg, #3b82f6, #1e40af)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ¡Bienvenido, Administrador!
          </h1>
          <div
            style={{
              fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
              opacity: 0.7,
              fontWeight: "500",
              textTransform: "capitalize",
              color: "#64748b",
            }}
          >
            <div>{fechaFormateada}</div>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "600",
                marginTop: "0.25rem",
                fontFamily: "monospace",
                color: "#1e293b",
              }}
            >
              {horaFormateada}
            </div>
          </div>
        </header>

        <main className="main-contenedor">
          <div className="grid-estadisticas">
            {tarjetas_config.map((config, index) => (
              <TarjetaEstadistica
                key={config.titulo}
                config={config}
                valor={datos[index]}
                spring={springs[index]}
              />
            ))}
          </div>

          <div className="carrusel">
            <animated.img
              key={imagenActual}
              src={imagenes[imagenActual]}
              alt="Imagen de vehículo"
              style={{
                ...imageTransition,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            />
            <div className="puntos">
              {imagenes.map((_, index) => (
                <div
                  key={index}
                  onClick={() => setImagenActual(index)}
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: imagenActual === index ? "white" : "rgba(255,255,255,0.5)",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>
        </main>
      </animated.div>

      <style>{`
        .main-contenedor {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .grid-estadisticas {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        .carrusel {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          height: 200px;
          flex-shrink: 0;
        }

        .puntos {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.4rem;
        }

        @media (min-width: 600px) {
          .grid-estadisticas {
            grid-template-columns: repeat(2, 1fr);
          }
          .carrusel {
            height: 250px;
          }
        }

        @media (min-width: 1024px) {
          .main-contenedor {
            flex-direction: row;
            padding: 4rem;
            padding-top: 0rem;
          }
          .grid-estadisticas {
            flex: 1;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(2, 1fr);
            height: 550px;
            gap: 1.5rem;
          }
          .carrusel {
            flex: 1;
            height: auto;
          }
        }
      `}</style>
    </div>
  );
}
