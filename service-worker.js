const NOTIFICATION_ICON = "/public/pictures/xmessenger-logo.jpg", EMPTY_STORAGE = {
    user: null
};

/**
 * Runtime swState object. Entries are provided from main thread.
 * {
 *     user: {} - Current user info.
 * }
 * @type {Object}
 */
let swState = {...EMPTY_STORAGE}, itemsToNotifyAbout = new Map();

const parsePushData = event => {
    try {
        return Promise.resolve(event.data.json());
    } catch (e) {
        console.error(e);
        return Promise.reject(`Push data: ${event.data.text()}`);
    }
};

const showNotification = (title, options) => {
    if (Notification.permission !== "granted") return;
    return self.registration.showNotification(title, {icon: NOTIFICATION_ICON, ...options});
};

const notifyOnIncomingRequest = eventDetails => {
    const {eventName, detail} = eventDetails, {request} = detail, {user} = swState;
    if (!!user && !itemsToNotifyAbout.has(request["id"])) { // avoid duplicate notifications;
        if (eventName === "onSendRequest" && request["recipient"]["id"] === user["id"]) {
            itemsToNotifyAbout.set(request["id"], request);
            showNotification({
                itemId: request["id"], title: "New friendship request!",
                options: {body: request["sender"]["name"] + " wants to befriend with you."}
            });
        } else if (eventName === "onProcessRequest" && request["sender"]["id"] === user["id"] && request["approved"]) {
            itemsToNotifyAbout.set(request["id"], request);
            showNotification({
                itemId: request["id"], title: "Friendship request approved!",
                options: {body: request["recipient"]["name"] + " accepted your friendship request."}
            });
        }
    }
};

self.addEventListener("push", event => {
    parsePushData(event)
        .then(eventData => {
            debugger;
            notifyOnIncomingRequest(eventData)
        })
        .catch(error => console.warn(error));
});

self.addEventListener("message", event => {
    const newSwState = JSON.parse(event.data);
    swState = {...newSwState};
});