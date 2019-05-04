self.addEventListener("install", event => {
    console.log("Service worker installed.");
    event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", event => {
    console.log("Service worker activated!");
    event.waitUntil(self.clients.claim());
});

self.addEventListener("push", event => {
    event.waitUntil(
        Promise.resolve().then(_ => {
            try {
                const eventDetails = event.data.json();
                console.log(">>> Got push", eventDetails);
                self.clients.matchAll({type: "worker"}).then(clients => {
                    clients.forEach(client => {
                        client.postMessage(eventDetails);
                    });
                });
            } catch (e) {
                console.warn(`Push notification: ${event.data.text()}`);
            }
        })
    );
});