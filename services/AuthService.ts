let logoutFn: (() => void) | null = null;

export const AuthService = {
    setLogout: (fn: () => void) => {
        logoutFn = fn;
    },
    logout: () => {
        if (logoutFn) {
            logoutFn();
        } else {
            console.warn('Logout function not set');
        }
    },
};
