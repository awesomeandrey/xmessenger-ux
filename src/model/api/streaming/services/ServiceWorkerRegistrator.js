import {performRequestLocally} from "../../rest/client-util";
import {CustomEvents} from "../../../services/utility/EventsService";
import {PUBLIC_VAPID_KEY} from "../../../constants";

const _serviceWorkerUrlPath = "service-worker.js"
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
}, _postMessage = data => navigator.serviceWorker.ready.then(_ => {
    navigator.serviceWorker.controller.postMessage(JSON.stringify(data));
});

export const registerServiceWorker = _ => {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register(_serviceWorkerUrlPath, {scope: "/"});
        navigator.serviceWorker.ready.then(registration => registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: _urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
        })).then(subscription => performRequestLocally({
            url: "/push-topics/subscribe",
            method: "POST",
            body: subscription
        })).then(_ => {
            // Setup 'data bridge' between client and service worker;
            navigator.serviceWorker.onmessage = event => {
                CustomEvents.fire(event.data);
            };
            return Notification.requestPermission();
        }).then(result => {
            console.log(`Notifications permission - ${result}`);
        }).catch(error => {
            console.error("Error when registering service worker.", error);
        });
    } else {
        console.warn("Service Workers are not allowed.");
    }
};

export const postMessageToServiceWorker = (dataObj, timeout = 0) => {
    if ("serviceWorker" in navigator) {
        setTimeout(_ => {
            _postMessage({command: "changeState", data: dataObj});
        }, timeout);
    }
};

export const dropState = _ => {
    if ("serviceWorker" in navigator) {
        return _postMessage({command: "reset"});
    } else {
        return Promise.resolve(null);
    }
};