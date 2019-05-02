import TOPICS from "./topics";
import Events from "../../events/application-events";
import {subscribe} from "./topics-manager";

import {CustomEvents} from "../../services/utility/EventsService";

const parsePayload = payload => JSON.parse(payload.body);

export default _ => subscribe([
    {
        route: TOPICS.CHAT.DELETE,
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
        route: TOPICS.CHAT.CLEAR,
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
        route: TOPICS.MESSAGE.SEND,
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
        route: TOPICS.REQUEST.SEND,
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
        route: TOPICS.REQUEST.PROCESS,
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