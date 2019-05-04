import Topics from "../core/topics";
import ApplicationEvents from "../../../events/application-events";

import {subscribe, parsePayload} from "../core/topics-manager";
import {CustomEvents} from "../../../services/utility/EventsService";

export default _ => subscribe([
    {
        route: Topics.CHAT.DELETE,
        callback: payload => {
            CustomEvents.fire({eventName: ApplicationEvents.CHAT.DELETE, detail: {removedChat: parsePayload(payload)}});
        }
    },
    {
        route: Topics.CHAT.CLEAR,
        callback: payload => {
            CustomEvents.fire({eventName: ApplicationEvents.CHAT.CLEAR, detail: {clearedChat: parsePayload(payload)}});
        }
    },
    {
        route: Topics.MESSAGE.SEND,
        callback: payload => {
            /**
             * {
             *     author: {...},
             *     body: "g",
             *     date: 1557004863202,
             *     id: 2298,
             *     relation: {id: 2276}
             * }
             */
            CustomEvents.fire({eventName: ApplicationEvents.MESSAGE.ADD, detail: {message: parsePayload(payload)}});
        }
    },
    {
        route: Topics.REQUEST.SEND,
        callback: payload => {
            CustomEvents.fire({eventName: ApplicationEvents.REQUEST.SEND, detail: {request: parsePayload(payload)}});
        }
    },
    {
        route: Topics.REQUEST.PROCESS,
        callback: payload => {
            CustomEvents.fire({eventName: ApplicationEvents.REQUEST.PROCESS, detail: {request: parsePayload(payload)}});
        }
    },
    {
        route: Topics.USER.INDICATOR_CHANGE,
        callback: payload => {
            /**
             * Payload body blueprint:
             * {
             *     user: {id:1111,...},
             *     loggedIn: true | false
             * }
             */
            const indicator = parsePayload(payload);
            CustomEvents.fire({eventName: ApplicationEvents.USER.INDICATOR_CHANGE, detail: {indicator}});
        }
    }
]);