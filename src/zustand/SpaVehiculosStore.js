import {create} from "zustand";
import { sliceSede } from "./sliceSede.js";
import {useCarritoStore} from "./sliceCart.js";
import { sliceCurrentUser } from "./sliceCurrentUser.js";
export const useSpaVehiculosStore = create((...a) => ({
    ...sliceSede(...a),
    ...useCarritoStore(...a),
    ...sliceCurrentUser(...a)
}));