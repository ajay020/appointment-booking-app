import { Logger } from "@/utils/logger";

let logoutFn: (() => void) | null = null;

export const AuthService = {
    setLogout: (fn: () => void) => {
        logoutFn = fn;
    },
    logout: () => {
        if (logoutFn) {
            logoutFn();
        } else {
            Logger.warn('Logout function not set');
        }
    },
};
