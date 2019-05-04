import webPush from "web-push";

webPush.setVapidDetails(
    "mailto:val@karpov.io", process.env.XM_PUBLIC_VAPID_KEY, process.env.XM_PRIVATE_VAPID_KEY
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
        console.error(error.stack);
    });
};

export const extractSubscriptionDetails = request => {
    console.log(">>> Request body:", request.body);

    _subscriptionDetails = request.body; // object full copy;
    _sendNotification({title: "test"});

    console.log(">>> Subscription details: ", _subscriptionDetails);
};