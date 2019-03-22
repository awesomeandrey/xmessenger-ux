const ERROR_MSG = "'Key' parameter should be of 'string' type when operating with storage!";

const Storage = storageObj => ({
    setItem: ({key, value}) => {
        if (typeof key !== "string") {
            throw ERROR_MSG;
        } else if (value == null) {
            // remove item from storage, so that when it's fetched it'll be 'null';
            storageObj.removeItem(key);
        } else if (typeof value !== "string") {
            value = JSON.stringify(value);
            storageObj.setItem(key, value);
        } else {
            storageObj.setItem(key, value);
        }
    },
    getItem: (key) => {
        if (typeof key !== "string") {
            throw ERROR_MSG;
        } else {
            const value = storageObj.getItem(key);
            if (!!value) {
                try {
                    return JSON.parse(value); // object || number;
                } catch (e) {
                    return value; // string;
                }
            } else {
                return null; // null;
            }
        }
    },
    removeItem: (key) => {
        storageObj.removeItem(key);
    },
    clear: _ => {
        storageObj.clear();
    }
});

module.exports = {
    SessionStorage: Storage(sessionStorage),
    SessionEntities: {
        JWT_TOKEN: "jwtToken",
        ACTIVE_CHAT: "activeChat",
        ACTIVE_TAB_KEY: "activeTabKey"
    },
    LocalStorage: Storage(localStorage),
    LocalEntities: {
        ACTIVE_THEME: "activeTheme"
    }
};