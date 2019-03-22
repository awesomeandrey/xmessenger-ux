// Constant names on custom events;
module.exports = {
    USER: {
        RELOAD: "onReloadUserInfo"
    },
    CHAT: {
        LOAD_ALL: "onLoadChats",
        SELECT: "onSelectChat",
        CLEAR: "onClearChat",
        DELETE: "onDeleteChat",
        CALCULATE: "onCalculateChats",
    },
    REQUEST: {
        SEND: "onSendRequest",
        PROCESS: "onProcessRequest",
        CALCULATE: "onCalculateRequests",
    },
    MESSAGE: {
        ADD: "onAddMessage"
    },
    SETTINGS: {
        LOCK: "onLockSettings",
        OPEN: "onOpenSettings",
        SELECT_TAB: "onSelectSettingsTab",
        LOAD_TAB: "onLoadSettingsTab"
    }
};