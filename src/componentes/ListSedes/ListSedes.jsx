import { getSedes } from "../../helpers/Sedes/getSedes.js";
import { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
} from "@mui/material";
import { useSpaVehiculosStore } from "../../zustand/SpaVehiculosStore.js";

export default function ListSedes() {
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentSede = useSpaVehiculosStore((state) => state.currentSede);
  const setCurrentSede = useSpaVehiculosStore((state) => state.setCurrentSede);
  const carrito = useSpaVehiculosStore((state) => state.carrito);

  const handleChange = (event) => {
    const nuevaSede = event.target.value;
    localStorage.setItem("Carrito" + currentSede, JSON.stringify(carrito));
    setCurrentSede(nuevaSede);
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await getSedes();

      if (!result || result.length === 0) {
        console.error("Error fetching sedes");
        setLoading(false);
        return;
      }

      const sedesFormateadas = result.map((s) => ({
        ...s,
        IdSede: String(s.IdSede),
      }));

      setSedes(sedesFormateadas);

      if (
        !currentSede ||
        !sedesFormateadas.some((s) => s.IdSede === String(currentSede))
      ) {
        setCurrentSede(sedesFormateadas[0].IdSede);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <FormControl fullWidth>
      <InputLabel id="Sede-label">Sede</InputLabel>

      {loading ? (
        <Skeleton variant="rounded" height={56} />
      ) : (
        <Select
          labelId="Sede-label"
          id="Sede-select"
          value={String(currentSede || "")}
          label="Sede"
          onChange={handleChange}
        >
          {sedes.map((sede) => (
            <MenuItem key={sede.IdSede} value={sede.IdSede}>
              {sede.Nombre}
            </MenuItem>
          ))}
        </Select>
      )}
    </FormControl>
  );
}
