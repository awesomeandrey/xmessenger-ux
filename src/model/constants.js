/**
 *  This file holds all app specific variables.
 *  Definitions prefixed with 'STATIC_' are provided by webpack bundler (intended for client hosted/downloaded scripts).
 *  In other situations, variables are read from environmental variables (intended for scripts run on server side).
 */

export const API_SERVER_URL = (_ => {
    try {
        return STATIC_API_SERVER_URL;
    } catch (e) {
        return process.env.XM_API_SERVER_URL;
    }
})();

export const DEV_EMAIL_ADDRESS = (_ => {
    try {
        return STATIC_DEV_EMAIL_ADDRESS;
    } catch (e) {
        return process.env.XM_DEV_EMAIL_ADDRESS;
    }
})();

export const PUBLIC_VAPID_KEY = (_ => {
    try {
        return STATIC_PUBLIC_VAPID_KEY;
    } catch (e) {
        return process.env.XM_PUBLIC_VAPID_KEY;
    }
})();

export const PRIVATE_VAPID_KEY = (_ => {
    try {
        return STATIC_PRIVATE_VAPID_KEY;
    } catch (e) {
        return process.env.XM_PRIVATE_VAPID_KEY;
    }
})();
