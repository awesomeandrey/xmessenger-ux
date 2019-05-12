import Topics from "../core/topics";
import TopicsToEvents from "../core/topics-to-events";

import {subscribe, sendMessage} from "../core/topics-manager";
import {CustomEvents} from "../../../services/utility/EventsService";

/**
 * Intended for devices which don't support service workers.
 *
 * @param _ none.
 */
export const subscribeFromClient = _ => {
    const registrations = TopicsToEvents.filter(topicToEvent => topicToEvent.topic !== Topics.USER.INDICATOR_CHANGE)
        .map(topicToEvent => {
            return {
                route: topicToEvent.topic,
                callback: payload => {
                    let eventDetails = topicToEvent.getEventDetails(payload);
                    CustomEvents.fire(eventDetails); // immediately fire application events;
                }
            };
        });
    subscribe(registrations);
};

/**
 * Intended for rich online experience mode.
 *
 * @param pushFunc - function responsible for sending push notifications.
 */
export const subscribeFromServer = pushFunc => {
    if (!!pushFunc && typeof pushFunc === "function") {
        const registrations = TopicsToEvents.map(topicToEvent => {
            return {
                route: topicToEvent.topic,
                callback: payload => {
                    let eventDetails = topicToEvent.getEventDetails(payload);
                    pushFunc(eventDetails); // application events details are passed to service worker;
                }
            };
        });
        subscribe(registrations);
    } else {
        console.error("'pushFunc' is not defined.");
    }
};

export const switchUserStatus = (user, loggedIn = true) => {
    if (!!user) {
        sendMessage({
            destination: "/indicator-change", body: {user, loggedIn}
        });
    }
};