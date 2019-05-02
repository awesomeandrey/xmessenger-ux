import TOPICS from "./topics";
import Events from "../../events/application-events";

import {subscribe} from "./topics-manager";
import {CustomEvents} from "../../services/utility/EventsService";

const parsePayload = payload => JSON.parse(payload.body);

export default _ => subscribe([
    {
        route: TOPICS.CHAT.DELETE,
        callback: payload => {
            CustomEvents.fire({eventName: Events.CHAT.DELETE, detail: {removedChat: parsePayload(payload)}});
        }
    },
    {
        route: TOPICS.CHAT.CLEAR,
        callback: payload => {
            CustomEvents.fire({eventName: Events.CHAT.CLEAR, detail: {clearedChat: parsePayload(payload)}});
        }
    },
    {
        route: TOPICS.MESSAGE.SEND,
        callback: payload => {
            CustomEvents.fire({eventName: Events.MESSAGE.ADD, detail: {message: parsePayload(payload)}});
        }
    },
    {
        route: TOPICS.REQUEST.SEND,
        callback: payload => {
            CustomEvents.fire({eventName: Events.REQUEST.SEND, detail: {request: parsePayload(payload)}});
        }
    },
    {
        route: TOPICS.REQUEST.PROCESS,
        callback: payload => {
            CustomEvents.fire({eventName: Events.REQUEST.PROCESS, detail: {request: parsePayload(payload)}});
        }
    },
    {
        route: TOPICS.USER.INDICATOR_CHANGE,
        callback: payload => {
            /**
             * Payload body blueprint:
             * {
             *     user: {id:1111,...},
             *     loggedIn: true | false
             * }
             */
            const indicator = parsePayload(payload);
            CustomEvents.fire({eventName: Events.USER.INDICATOR_CHANGE, detail: {indicator}});
        }
    }
]);