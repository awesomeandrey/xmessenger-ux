// self.importScripts("src/model/api/streaming/TopicsSubscriber.js");


self.addEventListener("install", event => {
    console.log("SW installed!");
});

self.addEventListener("activate", event => {
    console.log("SW activated!");
});

self.addEventListener('push', ev => {
    const data = ev.data.json();
    console.log('Got push', data);
    self.registration.showNotification(data.title, {
        body: 'Hello, World!',
        icon: 'http://mongoosejs.com/docs/images/mongoose5_62x30_transparent.png'
    });
});