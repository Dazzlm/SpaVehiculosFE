import {create} from "zustand";
import { sliceSede } from "./sliceSede.js";
import {useCarritoStore} from "./sliceCart.js";
export const useSpaVehiculosStore = create((...a) => ({
    ...sliceSede(...a),
    ...useCarritoStore(...a)
}));