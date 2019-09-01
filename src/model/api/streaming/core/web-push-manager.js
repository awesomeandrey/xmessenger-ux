import webPush from "web-push";

import {DEV_EMAIL_ADDRESS, PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY} from "./../../../constants";

webPush.setVapidDetails(
    `mailto:${DEV_EMAIL_ADDRESS}`, PUBLIC_VAPID_KEY, PRIVATE_VAPID_KEY
);

export const getPushNotificationFunc = subscription => data => {
    if (!subscription) {
        console.error("No subscription details provided.");
        return;
    }
    webPush.sendNotification(subscription, JSON.stringify(data)).catch(error => {
        console.error(">>> Couldn't send push notification.", error.stack);
    });
};