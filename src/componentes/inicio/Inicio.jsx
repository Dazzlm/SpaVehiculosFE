import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSpring, animated } from "@react-spring/web";
import { useSpaVehiculosStore } from "../../zustand/SpaVehiculosStore";

const tarjetas_config = [
  {
    titulo: "Clientes Registrados",
    icono: "👤",
    gradient: "linear-gradient(135deg, #ff6b6b, #ee5a52)",
    endpoint: "Clientes/Contar",
    dataKey: null,
  },
  {
    titulo: "Productos Registrados",
    icono: "📦",
    gradient: "linear-gradient(135deg, #4ecdc4, #44a08d)",
    endpoint: "Productos/Contar",
    dataKey: "cantidad",
  },
  {
    titulo: "Reservas Hoy",
    icono: "🗓️",
    gradient: "linear-gradient(135deg, yellow, yellow)",
    endpoint: `Reservas/ContarPorFecha?fecha=${
      new Date().toISOString().split("T")[0]
    }`,
    dataKey: "cantidad",
  },
  {
    titulo: "Ventas Hoy",
    icono: "🧾",
    gradient: "linear-gradient(135deg, aqua, aqua)",
    endpoint: "Facturas/ConsultarFacturasHoy",
    dataKey: "cantidad",
  },
];

const imagenes = [
  "https://plus.unsplash.com/premium_photo-1661501041641-3e731115e687?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FyJTIwd2FzaHxlbnwwfHwwfHx8MA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1661495725810-0e92d20311ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2FyJTIwd2FzaHxlbnwwfHwwfHx8MA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1661454209648-4764099a9be9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNhciUyMHdhc2h8ZW58MHx8MHx8fDA%3D",
  "https://images.unsplash.com/photo-1605164599901-f8a1464a2c87?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGNhciUyMHdhc2h8ZW58MHx8MHx8fDA%3D",
];

const TarjetaEstadistica = ({ config, valor, spring }) => {
  const estiloTarjeta = {
    background:
      config.titulo === "Clientes Registrados"
        ? "white"
        : "rgba(255, 255, 255, 0.95)",
    backdropFilter:
      config.titulo !== "Clientes Registrados" ? "blur(10px)" : "none",
    borderRadius: config.titulo === "Clientes Registrados" ? "16px" : "20px",
    padding: "2rem",
    border:
      config.titulo === "Clientes Registrados"
        ? "1px solid #e2e8f0"
        : "1px solid rgba(255,255,255,0.2)",
    transition: "all 0.3s ease",
  };

  return (
    <div style={estiloTarjeta}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1rem",
        }}
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
        <h3
          style={{
            margin: 0,
            fontSize: "1.2rem",
            color: "#333",
            fontWeight: "600",
          }}
        >
          {config.titulo}
        </h3>
      </div>
      <animated.div
        style={{
          textAlign: "center",
          fontSize: "3rem",
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
  const [datos, setDatos] = useState(Array(4).fill(null));
  const [fechaHora, setFechaHora] = useState(new Date());
  const [imagenActual, setImagenActual] = useState(0);
  const { currentUser } = useSpaVehiculosStore();

  useEffect(() => {
    const intervaloImagen = setInterval(() => {
      setImagenActual((prev) => (prev + 1) % imagenes.length);
    }, 4000);

    return () => clearInterval(intervaloImagen);
  }, []);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("CurrentUser"));
        const token = currentUser?.token || storedUser?.token;
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const promesas = tarjetas_config.map((config) =>
          axios.get(`https://spavehiculos.runasp.net/api/${config.endpoint}`, {
            headers,
          })
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
    useSpring({
      number: valor || 0,
      from: { number: 0 },
      config: { duration: 2000 },
    })
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
        height: "86h",
        width: "80vw",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <animated.div
        style={{
          ...fadeIn,
          position: "relative",
          zIndex: 1,
          height: "100%",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        <header style={{ textAlign: "center", color: "#1e293b" }}>
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

        <main
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
            alignItems: "center",
            maxHeight: "calc(100vh - 200px)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.5rem",
              height: "100%",
              justifyContent: "center",
            }}
          >
            {tarjetas_config.map((config, index) => (
              <TarjetaEstadistica
                key={config.titulo}
                config={config}
                valor={datos[index]}
                spring={springs[index]}
              />
            ))}
          </div>

          <div
            style={{
              height: "100%",
              position: "relative",
              borderRadius: "25px",
              overflow: "hidden",
            }}
          >
            <animated.img
              key={imagenActual}
              src={imagenes[imagenActual]}
              alt="Vehículo destacado"
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

            <div
              style={{
                position: "absolute",
                bottom: "1rem",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "0.5rem",
                zIndex: 2,
              }}
            >
              {imagenes.map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    background:
                      index === imagenActual
                        ? "rgba(255,255,255,0.9)"
                        : "rgba(255,255,255,0.4)",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onClick={() => setImagenActual(index)}
                />
              ))}
            </div>

            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "linear-gradient(45deg, rgba(0,0,0,0.1), transparent)",
                zIndex: 1,
              }}
            />
          </div>
        </main>
      </animated.div>
    </div>
  );
}
