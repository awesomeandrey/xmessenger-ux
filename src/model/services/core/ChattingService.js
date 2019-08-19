import {performRequest} from "../../api/rest/secureApi";

/**
 * Sample Chat entity structure;
 * {
        "chatId": 1509,
        "lastActivityDate": 45076324,
        "fellow": {},
        "lastUpdatedBy": {},
        "startedBy": {}
    }
 */
export const ChattingService = {
    /**
     * Sample response body:
     * {
        "content": [],
        "last": true,
        "totalElements": 0,
        "totalPages": 1,
        "size": 0,
        "number": 0,
        "sort": null,
        "first": true,
        "numberOfElements": 0
       }
     */
    loadChats: ({size = 5}) => performRequest({
        method: "GET",
        path: `/chats?size=${size}`
    }),
    sortChatsMap: chatsMap => {
        if (chatsMap instanceof Map && chatsMap.size) {
            let chatsArray = [...chatsMap.values()], propNameToSortBy = "lastActivityDate";
            chatsArray.sort((chatA, chatB) => {
                let dateA = new Date(chatA[propNameToSortBy]), dateB = new Date(chatB[propNameToSortBy]);
                return dateB - dateA;
            });
            return new Map(chatsArray.map(_ => [_["chatId"], _]));
        }
        return new Map();
    },
    removeChat: ({chatId}) => performRequest({
        method: "DELETE",
        path: `/chats/${chatId}/delete`,
        entity: arguments[0]
    }),
    clearChat: ({chatId}) => performRequest({
        method: "DELETE",
        path: `/chats/${chatId}/clear`,
        entity: arguments[0]
    }),
    loadMessagesMap: ({chatId}) => performRequest({
        method: "GET",
        path: `/chats/${chatId}/messages`
    }).then(messages => {
        const messagesMap = new Map(messages.reverse().map(_ => [_["id"], _]));
        return Promise.resolve(messagesMap);
    }),
    /**
     * {
     *     author: {}
           body: "hello"
           date: 1566200766054
           id: 1514
           relation: {id: 1513}
     * }
     */
    sendMessage: ({chat, messageBody}) => performRequest({
        method: "POST",
        path: `/chats/${chat["chatId"]}/messages`,
        entity: {
            relation: {id: chat["chatId"]},
            body: messageBody.trim()
        }
    })
};