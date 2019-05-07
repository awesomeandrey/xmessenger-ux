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
}, itemsToNotifyAbout = new Map(), _isMessageRelated = message => {
    if (storage.chatsArray.length === 0) return false;
    let relationId = message.relation.id;
    return !!storage.chatsArray.find(chat => chat.id === relationId);
};

const notifyOnIncomingMessage = eventDetails => {
    const {detail} = eventDetails, {message} = detail, {selectedChat} = storage;
    if (_isMessageRelated(message) && (!selectedChat || selectedChat.id !== message.relation.id)) {
        if (!itemsToNotifyAbout.has(message.id)) { // avoid duplicate notifications;
            itemsToNotifyAbout.set(message.id, message);
            self.registration.showNotification(message.author.name, {
                body: message.body,
                icon: NOTIFICATION_ICON
            }).then(_ => setTimeout(_ => {
                itemsToNotifyAbout.delete(message.id);
            }, 5000));
        }
    }
};

const notifyOnIncomingRequest = eventDetails => {
    const {eventName, detail} = eventDetails, {request} = detail, {user} = storage;
    debugger;
    if (!itemsToNotifyAbout.has(request.id)) { // avoid duplicate notifications;
        itemsToNotifyAbout.set(request.id, request);
        if (eventName === "onSendRequest" && request.recipient.id === user.id) {
            self.registration.showNotification("New friendship request!", {
                body: request.sender.name + " wants to befriend with you.",
                icon: NOTIFICATION_ICON
            });
        } else if (eventName === "onProcessRequest" && request.sender.id === user.id && request.approved) {
            self.registration.showNotification("Friendship request approved!", {
                body: request.recipient.name + " accepted your friendship request.",
                icon: NOTIFICATION_ICON
            });
        }
        setTimeout(_ => {
            itemsToNotifyAbout.delete(message.id);
        }, 5000);
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
                self.clients.matchAll({type: "worker"})
                    .then(clients => {
                        clients.forEach(client => client.postMessage(eventDetails));
                    })
                    .then(_ => {
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