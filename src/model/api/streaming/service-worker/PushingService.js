import {performRequestLocally} from "../../rest/client-util";

const _serviceWorkerUrlPath = "service-worker.js"
    , _PUBLIC_VAPID_KEY = STATIC_PUBLIC_VAPID_KEY // value provided by Webpack bundler;
    , _urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

export const registerServiceWorker = _ => {
    if ("serviceWorker" in navigator) {
        debugger;
        navigator.serviceWorker.register(_serviceWorkerUrlPath, {scope: "/"})
            .then(registration => {
                debugger;
                return registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: _urlBase64ToUint8Array(_PUBLIC_VAPID_KEY)
                });
            })
            .then(subscription => {
                debugger;
                return performRequestLocally({
                    url: "/push-topics/subscribe",
                    method: "POST",
                    body: subscription
                });
            })
            .catch(error => {
                debugger;
                console.error(error);
            });
    } else {
        console.warn("Service Workers are not allowed.");
    }
};