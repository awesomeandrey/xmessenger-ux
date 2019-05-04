self.addEventListener("install", event => {
    console.log("Service worker installed.");
});

self.addEventListener("activate", event => {
    console.log("SW activated!");
});

self.addEventListener("push", event => {
    const data = event.data.json();


    console.log(">>> Got push", data);


    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage(data);
        });
    });

    // self.registration.showNotification(data.title, {
    //     body: "Hello, World!",
    //     icon: "http://mongoosejs.com/docs/images/mongoose5_62x30_transparent.png"
    // });
});