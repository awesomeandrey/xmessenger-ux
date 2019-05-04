import Topics from "../core/topics";
import ApplicationEvents from "../../../events/application-events";

import {subscribe, parsePayload} from "../core/topics-manager";

export default pushFunc => {
    if (!!pushFunc && typeof pushFunc === "function") {
        subscribe([
            {
                route: Topics.CHAT.DELETE,
                callback: payload => {
                    pushFunc({eventName: ApplicationEvents.CHAT.DELETE, detail: {removedChat: parsePayload(payload)}});
                }
            },
            {
                route: Topics.CHAT.CLEAR,
                callback: payload => {
                    pushFunc({eventName: ApplicationEvents.CHAT.CLEAR, detail: {clearedChat: parsePayload(payload)}});
                }
            },
            {
                route: Topics.MESSAGE.SEND,
                callback: payload => {
                    pushFunc({eventName: ApplicationEvents.MESSAGE.ADD, detail: {message: parsePayload(payload)}});
                }
            },
            {
                route: Topics.REQUEST.SEND,
                callback: payload => {
                    pushFunc({eventName: ApplicationEvents.REQUEST.SEND, detail: {request: parsePayload(payload)}});
                }
            },
            {
                route: Topics.REQUEST.PROCESS,
                callback: payload => {
                    pushFunc({
                        eventName: ApplicationEvents.REQUEST.PROCESS,
                        detail: {request: parsePayload(payload)}
                    });
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
                    pushFunc({eventName: ApplicationEvents.USER.INDICATOR_CHANGE, detail: {indicator}});
                }
            }
        ]);
    } else {
        console.error("'pushFunc' is not defined.");
    }
};