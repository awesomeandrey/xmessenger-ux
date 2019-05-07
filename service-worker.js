/**
 * Runtime storage object. Entries are provided from main thread.
 *
 * @type {Object}
 */
let storage = {};

const notifyOnIncomingMessage = eventDetails => {
    debugger;
};
const notifyOnIncomingRequest = eventDetails => {
    debugger;
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
                        clients.forEach(client => client.postMessage(eventDetails))
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