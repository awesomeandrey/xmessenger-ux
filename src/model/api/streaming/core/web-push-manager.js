import webPush from "web-push";

webPush.setVapidDetails(
    `mailto:${process.env.XM_DEV_EMAIL_ADDRESS}`, process.env.XM_PUBLIC_VAPID_KEY, process.env.XM_PRIVATE_VAPID_KEY
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