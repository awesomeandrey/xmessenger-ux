import webPush from "web-push";

// TODO - set real email address;
webPush.setVapidDetails(
    "mailto:test@dev.io", process.env.XM_PUBLIC_VAPID_KEY, process.env.XM_PRIVATE_VAPID_KEY
);

/**
 * Initially this object is {null}; once client registers service worker
 * this object is fulfilled with subscription details required for
 * push notifications (rich online experience).
 *
 * @type Object
 * @private
 */
let _subscriptionDetails = null;

const _sendNotification = payload => {
    if (!_subscriptionDetails) {
        console.error("No subscription details provided.");
        return;
    }
    webPush.sendNotification(_subscriptionDetails, JSON.stringify(payload)).catch(error => {
        console.error(">>> Couldn't send push notification.", error.stack);
    });
};

export const extractSubscriptionDetails = request => {
    _subscriptionDetails = request.body;
    _sendNotification({title: "test"});
};

export const pushNotification = details => _sendNotification(details);