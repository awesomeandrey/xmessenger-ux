// Constant names on custom events;
export default {
    APP_DEFAULT: {
        LOADING: "onLoading"
    },
    USER: {
        RELOAD: "onReloadUserInfo",
        INDICATOR_CHANGE: "onIndicatorChange",
        SESSION_EXPIRED: "onSessionExpired"
    },
    CHAT: {
        INIT_LOAD_ALL: "onInitLoadChats",
        LOAD_ALL: "onLoadChats",
        SELECT: "onSelectChat",
        CLEAR: "onClearChat",
        DELETE: "onDeleteChat",
        CALCULATE: "onCalculateChats",
    },
    REQUEST: {
        INIT_LOAD_ALL: "onInitLoadRequests",
        LOAD_ALL: "onLoadRequests",
        SEND: "onSendRequest",
        PROCESS: "onProcessRequest",
        CALCULATE: "onCalculateRequests",
    },
    MESSAGE: {
        ADD: "onAddMessage"
    },
    SETTINGS: {
        LOCK: "onLockSettings",
        OPEN: "onOpenSettings"
    }
};