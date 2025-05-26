export const sliceSede = (set) => ({
  currentSede: null,
  isSedeLoaded: false,
  setCurrentSede: (sede) => set({ currentSede: sede, isSedeLoaded: true }), // Cambiado
});
