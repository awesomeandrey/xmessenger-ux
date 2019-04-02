const TOPICS_PREFIX = "/topic", TOPICS = {
    CHAT: {
        DELETE: `${TOPICS_PREFIX}/chat/delete`,
        CLEAR: `${TOPICS_PREFIX}/chat/clear`
    },
    MESSAGE: {
        SEND: `${TOPICS_PREFIX}/message/send`
    },
    REQUEST: {
        SEND: `${TOPICS_PREFIX}/request/send`,
        PROCESS: `${TOPICS_PREFIX}/request/process`
    }
};

module.exports = TOPICS;