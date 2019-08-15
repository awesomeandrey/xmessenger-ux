import React from "react";
import ApplicationEvents from "../../../../../../../../model/application-events";
import ToastEvents from "../../../../../../../common/components/toasts/toasts-events";
import EmptyArea from "../../../../../../../common/components/utils/EmptyArea";
import ChatItem from "./ChatItem";
import Button from "@salesforce/design-system-react/module/components/button";
import Spinner from "@salesforce/design-system-react/module/components/spinner";

import {ChattingService} from "../../../../../../../../model/services/core/ChattingService";
import {CustomEvents, KeyEvents} from "../../../../../../../../model/services/utility/EventsService";
import {SessionEntities, SessionStorage} from "../../../../../../../../model/services/utility/StorageService";
import {Utility} from "../../../../../../../../model/services/utility/UtilityService";
import {postMessageToServiceWorker} from "../../../../../../../../model/api/streaming/services/ServiceWorkerRegistrator";

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
            loading: true,
            selectedChat: null,
            chatsMap: new Map(),
            chatsLimit: 5,
            chatsLoadedAll: false
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
                    if (!!updatedBy && user.id !== updatedBy.id) {
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
    }

    handleLoadChats = (loadMore = false) => {
        let {chatsLimit, chatsLoadedAll} = this.state;
        if (typeof loadMore === "boolean" && loadMore && !chatsLoadedAll) {
            chatsLimit += 5;
        }
        this.setState({loading: true});
        ChattingService.loadChats({size: Math.min(chatsLimit, 100)})
            .then(pageResult => {
                const chatsArray = pageResult["content"];
                this.setState({
                    chatsMap: new Map(chatsArray.map(_ => [_.id, _])),
                    chatsLoadedAll: pageResult["last"], chatsLimit
                }, () => postMessageToServiceWorker({chatsArray}));
                return pageResult["totalElements"];
            })
            .then(chatsAmount => CustomEvents.fire({eventName: ApplicationEvents.CHAT.CALCULATE, detail: chatsAmount}))
            .then(_ => this.setState({loading: false}));
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
        const {chatsMap, chatsLoadedAll, loading} = this.state, chatItems = [...chatsMap.values()].map(chatData => {
            let selected = this.isSelectedChat(chatData);
            return (<div key={chatData["id"]} onClick={event => this.handleSelectChat(event, chatData)}
                         className={`chat-item ${selected && "theme-marker"}`}>
                <ChatItem chatData={chatData} selected={selected}/>
            </div>);
        });
        return (
            <div className="slds-scrollable_y">
                {Utility.isObjectEmpty(chatItems) && <EmptyArea title="There are no chats for now." icon="comments"/>}
                {!Utility.isObjectEmpty(chatItems) && <div className="slds-text-longform">{chatItems}</div>}
                {!Utility.isObjectEmpty(chatItems) && !chatsLoadedAll && !loading &&
                    <Button label="Load More..." className="slds-align_absolute-center"
                            onClick={_ => this.handleLoadChats(true)} variant="base"/>}
                {loading && <Spinner variant="brand" size="small"
                                     containerClassName="slds-p-vertical--small slds-spinner_container_overridden slds-is-relative"/>}
            </div>
        );
    }
}

export default ChatsTab;