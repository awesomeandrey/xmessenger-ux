import React from "react";
import ApplicationEvents from "../../../../../../../../model/application-events";
import NotificationEvents from "../../../../../../../common/components/notifications/notification-events";
import EmptyArea from "../../../../../../../common/components/utils/EmptyArea";
import ChatItem from "./ChatItem";
import Button from "@salesforce/design-system-react/module/components/button";
import Spinner from "@salesforce/design-system-react/module/components/spinner";

import {ChattingService} from "../../../../../../../../model/services/core/ChattingService";
import {CustomEvents, KeyEvents} from "../../../../../../../../model/services/utility/EventsService";
import {SessionEntities, SessionStorage} from "../../../../../../../../model/services/utility/StorageService";
import {Utility} from "../../../../../../../../model/services/utility/UtilityService";

import "./styles.css";

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
            eventName: ApplicationEvents.CHAT.CLEAR, callback: event => {
                const {clearedChat} = event.detail, {user: currentUser} = this.props;
                const lastUpdatedBy = clearedChat["lastUpdatedBy"];
                if (lastUpdatedBy && lastUpdatedBy["id"] !== currentUser["id"]) {
                    CustomEvents.fire({
                        eventName: NotificationEvents.SHOW,
                        detail: {message: <span><b>{lastUpdatedBy["name"]}</b> has just cleared chat history.</span>}
                    });
                }
            }
        });
        CustomEvents.register({
            eventName: ApplicationEvents.CHAT.DELETE, callback: event => {
                const {removedChat} = event.detail, {user: currentUser} = this.props, {chatsMap} = this.state;
                const lastUpdatedBy = removedChat["lastUpdatedBy"];
                if (chatsMap.delete(removedChat["chatId"])) {
                    if (lastUpdatedBy && lastUpdatedBy["id"] !== currentUser["id"]) {
                        CustomEvents.fire({
                            eventName: NotificationEvents.SHOW,
                            detail: {
                                level: "error",
                                message: <span><b>{lastUpdatedBy["name"]}</b> removed chat with you.</span>
                            }
                        });
                    }
                    if (this.isSelectedChat(removedChat)) {
                        CustomEvents.fire({eventName: ApplicationEvents.CHAT.SELECT, detail: {selectedChat: null}});
                    }
                    CustomEvents.fire({eventName: ApplicationEvents.CHAT.CALCULATE, detail: chatsMap.size})
                        .then(() => this.setState({chatsMap}));
                }
            }
        });
        CustomEvents.register({
            eventName: ApplicationEvents.CHAT.SELECT, callback: event => {
                const {selectedChat} = event.detail;
                SessionStorage.setItem({key: SessionEntities.ACTIVE_CHAT, value: selectedChat});
                this.setState({selectedChat});
            }
        });
        CustomEvents.register({
            eventName: ApplicationEvents.MESSAGE.ADD, callback: event => {
                const {message} = event.detail, {chatsMap} = this.state;
                const chatId = message["relation"]["id"];
                if (chatsMap.has(chatId)) {
                    let relatedChat = chatsMap.get(chatId);
                    relatedChat["lastActivityDate"] = message["date"];
                    this.setState({chatsMap: ChattingService.sortChatsMap(chatsMap.set(chatId, relatedChat))});
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
                    chatsMap: new Map(chatsArray.map(_ => [_["chatId"], _])),
                    chatsLoadedAll: pageResult["last"], chatsLimit
                });
                return pageResult["totalElements"];
            })
            .then(chatsAmount => CustomEvents.fire({eventName: ApplicationEvents.CHAT.CALCULATE, detail: chatsAmount}))
            .then(_ => this.setState({loading: false}));
    };

    handleSelectChat = (event, chatItem) => {
        if (event.target.nodeName === "BUTTON") return;
        CustomEvents.fire({eventName: ApplicationEvents.CHAT.SELECT, detail: {selectedChat: chatItem}});
    };

    isSelectedChat = chatItem => {
        const {selectedChat} = this.state;
        return !!selectedChat && !!chatItem && selectedChat["chatId"] === chatItem["chatId"];
    };

    render() {
        const {chatsMap, chatsLoadedAll, loading} = this.state, chatItems = [...chatsMap.values()].map(chatItem => {
            return <ChatItem key={chatItem["chatId"]} selected={this.isSelectedChat(chatItem)}
                             chat={chatItem} onClick={e => this.handleSelectChat(e, chatItem)}/>;
        });
        if (!chatItems.length) {
            return <EmptyArea title="There are no chats for now." icon="comments"/>;
        }
        return (
            <div className="slds-scrollable_y">
                <div className="slds-text-longform">{chatItems}</div>
                {!loading && !chatsLoadedAll && <Button label="Load More..." variant="base"
                                                        className="slds-align_absolute-center"
                                                        onClick={_ => this.handleLoadChats(true)}/>}
                {loading && <Spinner variant="brand" size="small"
                                     containerClassName="slds-p-vertical--small slds-spinner_container_overridden slds-is-relative"/>}
            </div>
        );
    }
}

export default ChatsTab;