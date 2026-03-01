/**
 * Logger utility — conditional logging based on environment.
 * In production, only errors and warnings are logged.
 * In development, all log levels are active.
 */

const isDev = process.env.NODE_ENV === 'development';

export const logger = {
    /** Debug info — only in development */
    log: (...args: unknown[]) => {
        if (isDev) console.log(...args);
    },

    /** Informational — only in development */
    info: (...args: unknown[]) => {
        if (isDev) console.info(...args);
    },

    /** Warnings — always logged */
    warn: (...args: unknown[]) => {
        console.warn(...args);
    },

    /** Errors — always logged */
    error: (...args: unknown[]) => {
        console.error(...args);
    },

    /** Debug — only in development */
    debug: (...args: unknown[]) => {
        if (isDev) console.debug(...args);
    },
};
