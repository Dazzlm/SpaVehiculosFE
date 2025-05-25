export const sliceSede = (set) => ({
    currentSede: "",
    setCurrentSede: (sede) => {
        set(() => ({
            currentSede: sede
        }));
    },
});