
import {getSedes} from "../../helpers/getSedes";
import { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useSpaVehiculosStore } from "../../zustand/SpaVehiculosStore.js";
import styles from "./ListSedes.module.css";
export default function ListSedes() {
    const [sedes, setSedes] = useState([]);
    const [selectedSede, setSelectedSede] = useState("");
    const setSede = useSpaVehiculosStore((state) => state.currentSede);
    const setCurrentSede = useSpaVehiculosStore((state) => state.setCurrentSede);
    const handleChange = (event) => {
        setSelectedSede(event.target.value);
        setCurrentSede(event.target.value);
        console.log(event.target.value);
    };

    useEffect(() => {
        const fetchData = async () => { 
            const result = await getSedes();

            if (result === undefined || result === null) {
                setSedes([]);
                console.error("Error fetching data");
                return;
            }
            console.log(result);
            
            setSedes(result);
        };
        fetchData();
    }, []);

    return (
       <FormControl fullWidth>
        <InputLabel id="Sede-label">Sede</InputLabel>
        <Select
            labelId="Sede-label"
            id="Sede-select"
            value={selectedSede?? ""}
            label="Sede"
            onChange={handleChange}
        >

            {sedes && sedes.map((sede) => (
                <MenuItem key={sede.IdSede} 
                        value={sede.IdSede}>
                    {sede.Nombre}
                </MenuItem>
            ))}
        </Select>
    </FormControl>
    );
}