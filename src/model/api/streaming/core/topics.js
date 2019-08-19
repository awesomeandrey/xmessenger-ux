const TOPICS_PREFIX = "/topic";

export default {
    CHAT: {
        DELETE: `${TOPICS_PREFIX}/chats/delete`,
        CLEAR: `${TOPICS_PREFIX}/chats/clear`
    },
    MESSAGE: {
        SEND: `${TOPICS_PREFIX}/messages/send`
    },
    REQUEST: {
        SEND: `${TOPICS_PREFIX}/requests/send`,
        PROCESS: `${TOPICS_PREFIX}/requests/process`
    },
    USER: {
        INDICATOR_CHANGE: `${TOPICS_PREFIX}/indicator-change`
    }
};