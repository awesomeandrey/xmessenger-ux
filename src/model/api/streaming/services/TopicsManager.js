import TopicsToEvents from "../core/topics-to-events";
import Topics from "../core/topics";

import {subscribe as subscribeToTopics} from "../core/topics-manager";
import {CustomEvents} from "../../../services/utility/EventsService";

/**
 * Intended for rich online experience mode (all streaming events are handled).
 */
const _subscribeFromClient = () => {
    const registrations = TopicsToEvents.map(topicToEvent => {
        return {
            route: topicToEvent.topic,
            callback: payload => {
                let eventDetails = topicToEvent.getEventDetails(payload);
                CustomEvents.fire(eventDetails); // immediately fire application events;
            }
        };
    });
    subscribeToTopics(registrations);
};

/**
 * Intended push notifications sent to service worker (limited scope of streaming events).
 *
 * @param pushFunc - function responsible for sending push notifications.
 */
const _subscribeFromServer = pushFunc => {
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
        subscribeToTopics(registrations);
    } else {
        console.error("'pushFunc' is not defined.");
    }
};

export default param => {
    if (!!param && typeof param === "function") {
        // push function passed;
        _subscribeFromServer(param);
    } else {
        _subscribeFromClient();
    }
};