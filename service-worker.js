const NOTIFICATION_ICON = "/public/pictures/xmessenger-logo.jpg", EMPTY_STORAGE = {
    user: null,
    selectedChat: null,
    chatsArray: [],
    richNotificationsEnabled: true
};

/**
 * Runtime storage object. Entries are provided from main thread.
 * {
 *     user: {} - current user info
 *     selectedChat: {} - selected chat from main thread
 *     chatsArray: {} - array of user chats
 * }
 * @type {Object}
 */
let storage = {...EMPTY_STORAGE}, itemsToNotifyAbout = new Map();

const _parseEventData = event => {
    try {
        return Promise.resolve(event.data.json());
    } catch (e) {
        console.error(e);
        return Promise.reject(`Push data: ${event.data.text()}`);
    }
};

const _isMessageRelated = message => {
    if (storage.chatsArray.length === 0) return false;
    let relationId = message.relation.id;
    return !!storage.chatsArray.find(chat => chat.id === relationId);
};

const _notify = ({itemId, title, options}) => {
    if (!storage.richNotificationsEnabled) return;
    self.registration.showNotification(title, {icon: NOTIFICATION_ICON, ...options})
        .then(_ => setTimeout(_ => itemsToNotifyAbout.delete(itemId), 5000));
};

const _postEvent = eventDetails => self.clients.matchAll({type: "worker"}).then(clients => {
    clients.forEach(client => client.postMessage(eventDetails));
});

const _notifyOnIncomingMessage = eventDetails => {
    const {detail} = eventDetails, {message} = detail, {selectedChat} = storage;
    if (_isMessageRelated(message)
        && (!selectedChat || selectedChat.id !== message.relation.id)
        && !itemsToNotifyAbout.has(message.id) // avoid duplicate notifications;
    ) {
        itemsToNotifyAbout.set(message.id, message);
        _notify({itemId: message.id, title: message.author.name, options: {body: message.body}});
    }
};

const _notifyOnIncomingRequest = eventDetails => {
    const {eventName, detail} = eventDetails, {request} = detail, {user} = storage;
    if (!itemsToNotifyAbout.has(request.id)) { // avoid duplicate notifications;
        if (eventName === "onSendRequest" && request.recipient.id === user.id) {
            itemsToNotifyAbout.set(request.id, request);
            _notify({
                itemId: request.id, title: "New friendship request!",
                options: {body: request.sender.name + " wants to befriend with you."}
            });
        } else if (eventName === "onProcessRequest" && request.sender.id === user.id && request.approved) {
            itemsToNotifyAbout.set(request.id, request);
            _notify({
                itemId: request.id, title: "Friendship request approved!",
                options: {body: request.recipient.name + " accepted your friendship request."}
            });
        }
    }
};

const _logoutUser = token => fetch("/logout", {
    method: "POST",
    body: JSON.stringify({token}),
    headers: {
        "Content-Type": "application/json",
    }
});

self.addEventListener("install", event => {
});

self.addEventListener("activate", event => {
    event.waitUntil(
        self.clients.claim()
    );
});

self.addEventListener("push", event => {
    event.waitUntil(
        _parseEventData(event).then(eventData => {
            _postEvent(eventData);
            return eventData;
        }).then(eventDetails => {
            let {eventName} = eventDetails;
            if (eventName.includes("Message")) {
                _notifyOnIncomingMessage(eventDetails);
            } else if (eventName.includes("Request")) {
                _notifyOnIncomingRequest(eventDetails);
            }
        }).catch(error => console.warn(error))
    );
});

self.addEventListener("message", event => {
    /**
     * Data passed within event;
     * {
     *     command: "changeState" | "reset"
     *     data: {...}
     * }
     */
    const {command, data} = JSON.parse(event.data);
    switch (command) {
        case "changeState":
            storage = {...storage, ...data};
            break;
        case "reset":
            storage = {...EMPTY_STORAGE};
            event.waitUntil(_logoutUser(data.token));
            break;
        default:
            console.warn("Unknown message.");
            break;
    }
});