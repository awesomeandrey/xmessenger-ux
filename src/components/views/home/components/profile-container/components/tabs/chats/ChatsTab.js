import React from "react";
import ApplicationEvents from "../../../../../../../../model/application-events";
import ToastEvents from "../../../../../../../common/components/toasts/toasts-events";
import EmptyArea from "../../../../../../../common/components/utils/EmptyArea";
import ChatItem from "./ChatItem";

import {ChattingService} from "../../../../../../../../model/services/core/ChattingService";
import {CustomEvents, KeyEvents} from "../../../../../../../../model/services/utility/EventsService";
import {SessionEntities, SessionStorage} from "../../../../../../../../model/services/utility/StorageService";
import {postMessageToServiceWorker} from "../../../../../../../../model/api/streaming/services/ServiceWorkerRegistrator";
import {UserService} from "../../../../../../../../model/services/core/UserService";

import "./styles.css";

const NOTIFICATION_BLUEPRINTS = {
    onChatCleared: userName => {
        CustomEvents.fire({
            eventName: ToastEvents.SHOW,
            detail: {message: <span><b>{userName}</b> has just cleared chat history.</span>}
        });
    },
    onChatDeleted: userName => {
        CustomEvents.fire({
            eventName: ToastEvents.SHOW,
            detail: {level: "error", message: <span><b>{userName}</b> removed chat with you.</span>}
        });
    }
};

class ChatsTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedChat: null,
            chatsMap: new Map()
        };
    }

    componentWillMount() {
        CustomEvents.register({eventName: ApplicationEvents.CHAT.LOAD_ALL, callback: this.handleLoadChats});

        CustomEvents.register({
            eventName: ApplicationEvents.CHAT.CLEAR,
            callback: event => {
                const {user} = this.props, {chatsMap} = this.state, {clearedChat} = event.detail;
                if (chatsMap.has(clearedChat.id)) {
                    const localChat = chatsMap.get(clearedChat.id), {updatedBy} = clearedChat;
                    if (user.id !== updatedBy.id) {
                        NOTIFICATION_BLUEPRINTS.onChatCleared(updatedBy.name);
                    }
                    chatsMap.set(localChat.id, Object.assign(localChat, {latestMessageDate: null}));
                    this.setState({chatsMap: chatsMap});
                }
            }
        });

        CustomEvents.register({
            eventName: ApplicationEvents.CHAT.DELETE,
            callback: event => {
                const {user} = this.props, {chatsMap} = this.state, {removedChat} = event.detail;
                if (chatsMap.has(removedChat.id)) {
                    const {updatedBy} = removedChat;
                    if (!!updatedBy && user.id !== updatedBy.id) {
                        NOTIFICATION_BLUEPRINTS.onChatDeleted(updatedBy.name);
                    }
                    if (chatsMap.delete(removedChat.id)) {
                        this.setState({chatsMap: chatsMap}, _ => {
                            CustomEvents.fire({
                                eventName: ApplicationEvents.CHAT.CALCULATE,
                                detail: chatsMap.size || 0
                            });
                            if (this.isSelectedChat(removedChat)) {
                                CustomEvents.fire({
                                    eventName: ApplicationEvents.CHAT.SELECT,
                                    detail: {selectedChat: null}
                                });
                            }
                        });
                    }
                }
            }
        });

        CustomEvents.register({
            eventName: ApplicationEvents.CHAT.SELECT,
            callback: event => {
                const {selectedChat} = event.detail;
                SessionStorage.setItem({key: SessionEntities.ACTIVE_CHAT, value: selectedChat});
                this.setState({selectedChat}, _ => {
                    postMessageToServiceWorker({selectedChat});
                });
            }
        });

        CustomEvents.register({
            eventName: ApplicationEvents.MESSAGE.ADD,
            callback: event => {
                const {chatsMap} = this.state, {message} = event.detail, {relation, date} = message;
                if (chatsMap.has(relation.id)) {
                    const chat = chatsMap.get(relation.id);
                    chatsMap.set(chat.id, Object.assign(chat, {latestMessageDate: date}));
                    this.setState({chatsMap: ChattingService.sortChatsMap(chatsMap)});
                }
            }
        });

        // 'Escape' button;
        KeyEvents.register({
            eventName: 'keydown', handler: event => {
                event = event || window.event;
                if (event.keyCode === 27) {
                    CustomEvents.fire({eventName: ApplicationEvents.CHAT.SELECT, detail: {selectedChat: null}});
                }
            }
        });
    }

    componentDidMount() {
        CustomEvents.fire({eventName: ApplicationEvents.CHAT.LOAD_ALL});
        const activeChat = SessionStorage.getItem(SessionEntities.ACTIVE_CHAT);
        if (!!activeChat) {
            CustomEvents.fire({eventName: ApplicationEvents.CHAT.SELECT, detail: {selectedChat: activeChat}});
        }
    }

    handleLoadChats = _ => {
        ChattingService.loadChatsMap()
            .then(chatsMap => {
                this.setState({chatsMap}, () => {
                    postMessageToServiceWorker({chatsArray: [...chatsMap.values()]});
                });
                return chatsMap.size || 0;
            })
            .then(chatsAmount => CustomEvents.fire({eventName: ApplicationEvents.CHAT.CALCULATE, detail: chatsAmount}));
    };

    handleSelectChat = (event, chatData) => {
        if (event.target.nodeName === "BUTTON") return;
        CustomEvents.fire({eventName: ApplicationEvents.CHAT.SELECT, detail: {selectedChat: chatData}});
    };

    isSelectedChat = chat => {
        const {selectedChat} = this.state;
        return !!selectedChat && !!chat && selectedChat.id === chat.id;
    };

    render() {
        const {chatsMap} = this.state, chatItems = [...chatsMap.values()].map(chatData => {
            let selected = this.isSelectedChat(chatData);
            return (<div key={chatData["id"]} onClick={event => this.handleSelectChat(event, chatData)}
                         className={`chat-item ${selected && "theme-marker"}`}>
                <ChatItem chatData={chatData} selected={selected}/>
            </div>);
        });
        return (
            <div className="slds-scrollable_y">
                {chatItems.length === 0
                    ? <EmptyArea title="There are no chats for now." icon="comments"/>
                    : <div className="slds-text-longform">{chatItems}</div>}
            </div>
        );
    }
}

export default ChatsTab;