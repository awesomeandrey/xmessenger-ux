import {performRequest} from "../../api/rest/secureApi";

const _sortChatsByLatestMessageDate = chatsArray => {
        if (!Array.isArray(chatsArray)) return [];
        const propName = "latestMessageDate";
        return chatsArray.sort((chatA, chatB) => {
            let dateA = new Date(chatA[propName]), dateB = new Date(chatB[propName]);
            return dateB - dateA;
        });
    },
    _chatsArrayToMap = chatsArray => Array.isArray(chatsArray) ? new Map(chatsArray.map(chat => [chat.id, chat])) : new Map(),
    _parseChatItems = chatsArray => _chatsArrayToMap(_sortChatsByLatestMessageDate(chatsArray));

export const ChattingService = {
    loadChatsMap: _ => performRequest({
        method: "GET",
        path: "/chats/"
    }).then(chatsArray => {
        const chatsMap = _parseChatItems(chatsArray);
        return Promise.resolve(chatsMap)
    }),
    sortChatsMap: chatsMap => {
        if (chatsMap instanceof Map && chatsMap.size > 0) {
            return _parseChatItems([...chatsMap.values()]);
        }
        return new Map();
    },
    removeChat: chat => performRequest({
        method: "DELETE",
        path: `/chats/${chat.id}/delete`,
        entity: chat
    }),
    clearChat: chat => performRequest({
        method: "DELETE",
        path: `/chats/${chat.id}/clear`,
        entity: chat
    }),
    loadMessagesMap: (chat) => performRequest({
        method: "GET",
        path: `/chats/${chat.id}/messages`
    }).then(messages => {
        const messagesMap = new Map(messages.reverse().map(message => [message.id, message]));
        return Promise.resolve(messagesMap);
    }),
    sendMessage: ({chat, messageBody}) => performRequest({
        method: "POST",
        path: `/chats/${chat.id}/messages`,
        entity: {
            relation: {id: chat.id},
            body: messageBody
        }
    })
};