import {performLocalRequest} from "../../rest/client-util";
import {PUBLIC_VAPID_KEY} from "../../../constants";
import {Utility} from "../../../services/utility/UtilityService";

const serviceWorkerUrlPath = "service-worker.js", urlBase64ToUint8Array = (base64String) => {
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

const postMessage = data => navigator.serviceWorker.ready.then(_ => {
    navigator.serviceWorker.controller.postMessage(JSON.stringify(data));
    return data;
}).catch(error => {
    console.error("Could not post message to SW.", error);
});

export const serviceWorkerAllowed = ("serviceWorker" in navigator) && !Utility.isMobileDevice();

export const registerServiceWorker = _ => {
    if (serviceWorkerAllowed) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            if (Utility.isObjectEmpty(registrations)) {
                navigator.serviceWorker.register(serviceWorkerUrlPath, {scope: "/"});
            }
        });
        navigator.serviceWorker.ready.then(registration => registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
        })).then(subscriptionDetails => performLocalRequest({
            url: "/subscribe",
            method: "POST",
            body: subscriptionDetails
        })).then(_ => {
            // Setup connection between main thread and SW;
            // navigator.serviceWorker.onmessage = event => {
            //     console.log(event.data);
            // };
            return Notification.requestPermission();
        }).then(result => {
            console.log(`Notifications permission - ${result}.`);
        }).catch(error => {
            console.error("Error when registering service worker.", error);
        });
    } else {
        console.warn("Service Workers are not allowed.");
    }
};

export const postMessageToServiceWorker = (swState) => {
    if (serviceWorkerAllowed) {
        return postMessage(swState);
    }
    return Promise.resolve(swState);
};

export const dropServiceWorkerState = _ => {
    if (serviceWorkerAllowed) {
        return postMessage({user: null});
    }
    return Promise.resolve(0);
};