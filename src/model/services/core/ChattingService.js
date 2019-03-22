import {performRequest} from "../../api/rest/secureApi";

class ChattingUtility {
    static sortChatsArrayByLastMessageDate(chatsArray) {
        if (Array.isArray(chatsArray)) {
            const propName = "latestMessageDate";
            chatsArray.sort((chatA, chatB) => {
                let dateA = new Date(chatA[propName]), dateB = new Date(chatB[propName]);
                return dateB - dateA;
            });
        }
        return chatsArray;
    }

    static convertChatsArrayToMap(chatsArray) {
        return new Map(chatsArray.map(chat => [chat.id, chat]));
    }
}

module.exports = {
    ChattingService: {
        loadChatsMap: _ => performRequest({
            method: "GET",
            path: "/chats/"
        }).then(unsortedChats => {
            const sortedChats = ChattingUtility.sortChatsArrayByLastMessageDate(unsortedChats),
                chatsMap = ChattingUtility.convertChatsArrayToMap(sortedChats);
            return Promise.resolve(chatsMap);
        }),
        sortChats: chatsMap => {
            if (chatsMap instanceof Map) {
                let chatsArray = Array.from(chatsMap.values());
                const sortedChats = ChattingUtility.sortChatsArrayByLastMessageDate(chatsArray);
                chatsMap = ChattingUtility.convertChatsArrayToMap(sortedChats);
            }
            return Promise.resolve(chatsMap);
        },
        loadMessagesMap: ({chat, itemCallback}) => {
            return performRequest({
                method: "GET",
                path: `/chats/${chat.id}/messages`
            }).then(messages => {
                let messagesMap = new Map();
                messages.reverse().forEach(msg => {
                    let entry = itemCallback(msg);
                    messagesMap.set(entry.id, entry);
                });
                return Promise.resolve(messagesMap);
            });
        },
        sendMessage: ({chat, messageBody}) => performRequest({
            method: "POST",
            path: `/chats/${chat.id}/messages`,
            entity: {
                relation: {id: chat.id},
                body: messageBody
            }
        }),
        removeChat: chat => performRequest({
            method: "DELETE",
            path: `/chats/${chat.id}/delete`,
            entity: chat
        }),
        clearChat: chat => performRequest({
            method: "DELETE",
            path: `/chats/${chat.id}/clear`,
            entity: chat
        })
    }
};