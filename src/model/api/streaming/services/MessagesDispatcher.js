import {sendMessage} from "../core/topics-manager";

const _notifyOnUserStatusChange = (user) => (active = false) => {
    if (!user) return;
    const dateStamp = new Date();
    sendMessage({destination: "/indicator-change", body: {user, active, dateStamp}});
};

export const notifyOnUserLogin = user => _notifyOnUserStatusChange(user)(true);

export const notifyOnUserLogout = user => _notifyOnUserStatusChange(user)(false);