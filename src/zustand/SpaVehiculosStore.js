import {create} from "zustand";
import { sliceSede } from "./sliceSede.js";
export const useSpaVehiculosStore = create((...a) => ({
    ...sliceSede(...a)
}));