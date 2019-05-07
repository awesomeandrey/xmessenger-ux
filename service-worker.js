const NOTIFICATION_ICON = "/public/pictures/xmessenger-logo.jpg";

/**
 * Runtime storage object. Entries are provided from main thread.
 * {
 *     user: {} - current user info
 *     selectedChat: {} - selected chat from main thread
 *     chatsArray: {} - array of user chats
 * }
 * @type {Object}
 */
let storage = {
    user: null,
    selectedChat: null,
    chatsArray: []
}, itemsToNotifyAbout = new Map();

const _isMessageRelated = message => {
    if (storage.chatsArray.length === 0) return false;
    let relationId = message.relation.id;
    return !!storage.chatsArray.find(chat => chat.id === relationId);
}, _notify = ({itemId, title, options}) => {
    self.registration.showNotification(title, {icon: NOTIFICATION_ICON, ...options})
        .then(_ => setTimeout(_ => itemsToNotifyAbout.delete(itemId), 5000));
}, _postEvent = eventDetails => self.clients.matchAll({type: "worker"}).then(clients => {
    clients.forEach(client => client.postMessage(eventDetails));
});

const notifyOnIncomingMessage = eventDetails => {
    const {detail} = eventDetails, {message} = detail, {selectedChat} = storage;
    if (_isMessageRelated(message)
        && (!selectedChat || selectedChat.id !== message.relation.id)
        && !itemsToNotifyAbout.has(message.id)// avoid duplicate notifications;
    ) {
        itemsToNotifyAbout.set(message.id, message);
        _notify({itemId: message.id, title: message.author.name, options: {body: message.body}});
    }
};

const notifyOnIncomingRequest = eventDetails => {
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

self.addEventListener("install", event => {
});

self.addEventListener("activate", event => {
    event.waitUntil(
        self.clients.claim()
    );
});

self.addEventListener("push", event => {
    event.waitUntil(
        Promise.resolve().then(_ => {
            try {
                const eventDetails = event.data.json();
                _postEvent(eventDetails).then(_ => {
                    let {eventName} = eventDetails;
                    if (eventName.includes("Message")) {
                        notifyOnIncomingMessage(eventDetails);
                    } else if (eventName.includes("Request")) {
                        notifyOnIncomingRequest(eventDetails);
                    }
                });
            } catch (e) {
                console.warn(`Push notification: ${event.data.text()}`);
            }
        })
    );
});

self.addEventListener("message", event => {
    const data = JSON.parse(event.data);
    storage = {...storage, ...data};
});