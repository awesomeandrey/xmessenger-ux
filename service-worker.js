self.addEventListener("install", event => {
    console.log("Service worker installed.");
});

self.addEventListener("activate", event => {
    console.log("SW activated!");
});

self.addEventListener("push", event => {
    try {
        const eventDetails = event.data.json();
        console.log(">>> Got push", eventDetails);
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage(eventDetails);
            });
        });
    } catch (e) {
        console.warn(`Push notification: ${event.data.text()}`);
    }
    // TODO - setup message notifications on [newMessage, newRequest];
    // self.registration.showNotification(data.title, {
    //     body: "Hello, World!",
    //     icon: "http://mongoosejs.com/docs/images/mongoose5_62x30_transparent.png"
    // });
});