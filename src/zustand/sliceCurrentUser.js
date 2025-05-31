import { isTokenExpired } from "../helpers/Auth/isTokenExpired";


export const sliceCurrentUser = (set) => ({
    currentUser: null,
  isUserLoaded: false,

  setCurrentUser: (user) => set({ currentUser: user, isUserLoaded: true }),

  clearCurrentUser: () => {
    localStorage.removeItem('CurrentUser');
    set({ currentUser: null, isUserLoaded: false });
  },

  loadCurrentUser: () => {
    const stored = localStorage.getItem('CurrentUser');
    if (!stored) return set({ currentUser: null, isUserLoaded: false });

    try {
      const user = JSON.parse(stored);
      if (isTokenExpired(user.exp)) {
        localStorage.removeItem('CurrentUser');
        set({ currentUser: null, isUserLoaded: false });
      } else {
        set({ currentUser: user, isUserLoaded: true });
      }
    } catch {
      set({ currentUser: null, isUserLoaded: false });
    }
  },
});