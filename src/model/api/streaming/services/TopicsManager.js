import TopicsToEvents from "../core/topics-to-events";
import Topics from "../core/topics";

import {subscribe} from "../core/topics-manager";
import {CustomEvents} from "../../../services/utility/EventsService";

/**
 * Intended for rich online experience mode (all streaming events are handled).
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
 * Intended push notifications sent to service worker (limited scope of streaming events).
 *
 * @param pushFunc - function responsible for sending push notifications.
 */
export const subscribeFromServer = pushFunc => {
    if (!!pushFunc && typeof pushFunc === "function") {
        const registrations = TopicsToEvents
            .filter(topicToEventEntity => {
                return [Topics.REQUEST.SEND, Topics.REQUEST.SEND].includes(topicToEventEntity.topic);
            })
            .map(topicToEvent => {
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