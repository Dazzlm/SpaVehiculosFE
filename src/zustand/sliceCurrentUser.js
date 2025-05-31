export const sliceCurrentUser = (set) => ({
  currentUser: null,
  isUserLoaded: false,
  setCurrentUser: (user) => set({ currentUser: user, isUserLoaded: true }),
  clearCurrentUser: () => set({ currentUser: null, isUserLoaded: false }),
    loadCurrentUser: () => {
        const user = localStorage.getItem('CurrentUser');
        if (user) {
        set({ currentUser: user, isUserLoaded: true });
        } else {
        set({ currentUser: null, isUserLoaded: false });
        }
    },

});