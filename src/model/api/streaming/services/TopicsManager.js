import TopicsToEvents from "../core/topics-to-events";

import {subscribe} from "../core/topics-manager";
import {CustomEvents} from "../../../services/utility/EventsService";

/**
 * Intended for rich online experience mode.
 */
export const subscribeFromClient = _ => {
    const registrations = TopicsToEvents.map(topicToEvent => {
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