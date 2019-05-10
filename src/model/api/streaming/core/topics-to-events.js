import Topics from "./topics";
import ApplicationEvents from "../../../events/application-events";

import {parsePayload} from "./topics-manager";

/**
 * Array of push topics and matching application events;
 */
export default [
    {
        topic: Topics.CHAT.DELETE,
        getEventDetails: payload => ({
            eventName: ApplicationEvents.CHAT.DELETE,
            detail: {removedChat: parsePayload(payload)}
        })
    },
    {
        topic: Topics.CHAT.CLEAR,
        getEventDetails: payload => ({
            eventName: ApplicationEvents.CHAT.CLEAR,
            detail: {clearedChat: parsePayload(payload)}
        })
    },
    {
        topic: Topics.MESSAGE.SEND,
        getEventDetails: payload => ({
            eventName: ApplicationEvents.MESSAGE.ADD,
            detail: {message: parsePayload(payload)}
        })
    },
    {
        topic: Topics.REQUEST.SEND,
        getEventDetails: payload => ({
            eventName: ApplicationEvents.REQUEST.SEND,
            detail: {request: parsePayload(payload)}
        })
    },
    {
        topic: Topics.REQUEST.PROCESS,
        getEventDetails: payload => ({
            eventName: ApplicationEvents.REQUEST.PROCESS,
            detail: {request: parsePayload(payload)}
        })
    },
    {
        /**
         * Payload body blueprint:
         * {
         *     user: {id:1111,...},
         *     loggedIn: true | false
         * }
         */
        topic: Topics.USER.INDICATOR_CHANGE,
        getEventDetails: payload => ({
            eventName: ApplicationEvents.USER.INDICATOR_CHANGE,
            detail: {indicator: parsePayload(payload)}
        })
    }
];