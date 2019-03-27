const NOTIFICATION_ICON = "public/pictures/xmessenger-logo.jpg";
const NOTIFICATION_GRANTED_STATUS = "granted";
const SUPPORTS_NOTIFICATIONS = "Notification" in window;

module.exports = {
    Notifier: {
        requestPermission: _ => {
            if (SUPPORTS_NOTIFICATIONS) {
                Notification.requestPermission()
                    .then(permission => console.log(`Notifications permission - ${permission}`));
            }
        },
        notify: ({title, text, onclick}) => {
            if (SUPPORTS_NOTIFICATIONS && Notification.permission === NOTIFICATION_GRANTED_STATUS) {
                let notification = new Notification(
                    title, {body: text, icon: NOTIFICATION_ICON}
                );
                notification.onclick = onclick;
                setTimeout(notification.close.bind(notification), 4000);
            }
        }
    }
};