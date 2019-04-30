import TOPICS from "./topics";
import subscribeToTopics from "./topics-subscriber";

const _parsePayload = payload => JSON.parse(payload.body);

export default _ => subscribeToTopics([
    {
        route: TOPICS.CHAT.DELETE,
        callback: payload => {
            const removedChat = _parsePayload(payload);
            // CustomEvents.fire({
            //     eventName: Events.CHAT.DELETE,
            //     detail: {
            //         removedChat: removedChat
            //     }
            // });
        }
    },
    {
        route: TOPICS.CHAT.CLEAR,
        callback: payload => {
            const clearedChat = _parsePayload(payload);
            // CustomEvents.fire({
            //     eventName: Events.CHAT.CLEAR,
            //     detail: {
            //         clearedChat: clearedChat
            //     }
            // });
            console.log('Cleared chat', clearedChat);
        }
    },
    {
        route: TOPICS.MESSAGE.SEND,
        callback: payload => {
            const message = _parsePayload(payload);
            // CustomEvents.fire({
            //     eventName: Events.MESSAGE.ADD,
            //     detail: {
            //         message: message
            //     }
            // });
        }
    },
    {
        route: TOPICS.REQUEST.SEND,
        callback: payload => {
            const sentRequest = _parsePayload(payload);
            // CustomEvents.fire({
            //     eventName: Events.REQUEST.SEND,
            //     detail: {
            //         request: sentRequest
            //     }
            // });
        }
    },
    {
        route: TOPICS.REQUEST.PROCESS,
        callback: payload => {
            const processedRequest = _parsePayload(payload);
            // CustomEvents.fire({
            //     eventName: Events.REQUEST.PROCESS,
            //     detail: {
            //         request: processedRequest
            //     }
            // });
        }
    }
]);