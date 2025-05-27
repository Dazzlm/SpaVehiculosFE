import { getSedes } from "../../helpers/getSedes";
import { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useSpaVehiculosStore } from "../../zustand/SpaVehiculosStore.js";

export default function ListSedes() {
    const [sedes, setSedes] = useState([]);

    const currentSede = useSpaVehiculosStore((state) => state.currentSede);
    const setCurrentSede = useSpaVehiculosStore((state) => state.setCurrentSede);

    const handleChange = (event) => {
        setCurrentSede(event.target.value);
        
    };

    useEffect(() => {
        const fetchData = async () => {
            const result = await getSedes();

            if (!result || result.length === 0) {
            console.error("Error fetching sedes");
            return;
            }

            setSedes(result);
            if (!currentSede) {
            setCurrentSede(result[0].IdSede);
            }
        };
        fetchData();
    }, []);


    return (
       <FormControl fullWidth>
        <InputLabel id="Sede-label">Sede</InputLabel>
        <Select
            labelId="Sede-label"
            id="Sede-select"
            value={currentSede || ""}
            label="Sede"
            onChange={handleChange}
        >
            {sedes.map((sede) => (
                <MenuItem key={sede.IdSede} value={sede.IdSede}>
                    {sede.Nombre}
                </MenuItem>
            ))}
        </Select>
    </FormControl>
    );
}
