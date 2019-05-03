import {sendMessage} from "./topics-manager";

const _notifyOnUserStatusChange = (user) => (loggedIn = false) => {
    if (!user) return;
    const dateStamp = new Date();
    sendMessage({destination: "/indicator-change", body: {user, loggedIn, dateStamp}});
};

export const notifyOnUserLogin = user => _notifyOnUserStatusChange(user)(true);

export const notifyOnUserLogout = user => _notifyOnUserStatusChange(user)(false);