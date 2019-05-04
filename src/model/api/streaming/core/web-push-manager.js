import webPush from "web-push";

// TODO - set real email address;
webPush.setVapidDetails(
    "mailto:test@dev.io", process.env.XM_PUBLIC_VAPID_KEY, process.env.XM_PRIVATE_VAPID_KEY
);

export const pushNotification = subscription => data => {
    if (!subscription) {
        console.error("No subscription details provided.");
        return;
    }
    webPush.sendNotification(subscription, JSON.stringify(data)).catch(error => {
        console.error(">>> Couldn't send push notification.", error.stack);
    });
};