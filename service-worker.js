self.addEventListener("install", event => {
    event.waitUntil(
        self.skipWaiting().then(_ => {
            // TODO - create IndexDB for storing current user info;

        })
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        Notification.requestPermission()
            .then(permission => {
                console.log(`Notifications permission - ${permission}.`);
                return self.clients.claim();
            })
    );
});

self.addEventListener("push", event => {
    event.waitUntil(
        Promise.resolve().then(_ => {
            try {
                const eventDetails = event.data.json();
                self.clients.matchAll({type: "worker"})
                    .then(clients => clients.forEach(client => client.postMessage(eventDetails)))
                    .then(_ => {
                        if (eventDetails.eventName.includes("Message")) {
                            // TODO - push notifications in incoming messages related to current user;

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
    debugger;

    if (Notification.permission === "granted") {
        navigator.serviceWorker.getRegistration().then(reg => {
            let options = {
                title: `New message from ${chat.fellow.name}`,
                text: message.body,
                icon: "public/pictures/xmessenger-logo.jpg"
            };
            reg.showNotification("", options);
        });
    }

});