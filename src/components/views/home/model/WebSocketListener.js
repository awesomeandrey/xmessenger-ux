import Events from "./HomePageEvents";

import {CustomEvents} from "../../../../model/services/utility/EventsService";
import {register} from "../../../../model/api/ws/websocket-listener";

const CHANNELS_PREFIX = "/topic", CHANNELS = {
    CHAT: {
        DELETE: `${CHANNELS_PREFIX}/chat/delete`,
        CLEAR: `${CHANNELS_PREFIX}/chat/clear`
    },
    MESSAGE: {
        SEND: `${CHANNELS_PREFIX}/message/send`
    },
    REQUEST: {
        SEND: `${CHANNELS_PREFIX}/request/send`,
        PROCESS: `${CHANNELS_PREFIX}/request/process`
    }
};

const parsePayload = payload => JSON.parse(payload.body), addServerListeners = _ => {
    register([
        {
            route: CHANNELS.CHAT.DELETE,
            callback: payload => {
                const removedChat = parsePayload(payload);
                CustomEvents.fire({
                    eventName: Events.CHAT.DELETE,
                    detail: {
                        removedChat: removedChat
                    }
                });
            }
        },
        {
            route: CHANNELS.CHAT.CLEAR,
            callback: payload => {
                const clearedChat = parsePayload(payload);
                CustomEvents.fire({
                    eventName: Events.CHAT.CLEAR,
                    detail: {
                        clearedChat: clearedChat
                    }
                });
            }
        },

        {
            route: CHANNELS.MESSAGE.SEND,
            callback: payload => {
                const message = parsePayload(payload);
                CustomEvents.fire({
                    eventName: Events.MESSAGE.ADD,
                    detail: {
                        message: message
                    }
                });
            }
        },

        {
            route: CHANNELS.REQUEST.SEND,
            callback: payload => {
                const sentRequest = parsePayload(payload);
                CustomEvents.fire({
                    eventName: Events.REQUEST.SEND,
                    detail: {
                        request: sentRequest
                    }
                });
            }
        },
        {
            route: CHANNELS.REQUEST.PROCESS,
            callback: payload => {
                const processedRequest = parsePayload(payload);
                CustomEvents.fire({
                    eventName: Events.REQUEST.PROCESS,
                    detail: {
                        request: processedRequest
                    }
                });
            }
        }
    ]);
};

module.exports = {
    registerServerListeners: _ => {
        CustomEvents.register({
            eventName: "load",
            callback: addServerListeners
        });
    }
};