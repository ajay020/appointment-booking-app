export const Logger = {
    log: (...args: any[]) => {
        if (__DEV__) console.log('[LOG]', ...args);
    },
    error: (...args: any[]) => {
        if (__DEV__) {
            console.error('[ERROR]', ...args);
        } else {
            // TODO: send to Sentry or server
        }
    },
};
