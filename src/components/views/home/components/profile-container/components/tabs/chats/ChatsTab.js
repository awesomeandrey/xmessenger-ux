import React from "react";
import Events from "../../../../../model/HomePageEvents";
import ToastEvents from "../../../../../../../common/components/toasts/events";
import DnDEvents from "../../../../../../../common/components/dnd/events";
import EmptyArea from "../../../../../../../common/components/utils/EmptyArea";
import ChatItem from "./ChatItem";

import {ChattingService} from "../../../../../../../../model/services/core/ChattingService";
import {CustomEvents, KeyEvents} from "../../../../../../../../model/services/utility/EventsService";
import {SessionEntities, SessionStorage} from "../../../../../../../../model/services/utility/StorageService";
import {DropTarget} from "react-dnd/lib/index";
import {ItemTypes} from "../../../../../../../common/components/dnd/ItemTypes";
import {Utility} from "../../../../../../../../model/services/utility/UtilityService";
import {Notifier} from "../../../../../../../../model/services/utility/NotificationsService";
import {Icon} from "react-lightning-design-system";

class ChatsTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chatsMap: new Map(),
            selectedChat: null
        };
    }

    componentWillMount() {
        CustomEvents.register({eventName: Events.CHAT.LOAD_ALL, callback: this.handleLoadChats});

        CustomEvents.register({
            eventName: Events.CHAT.DELETE,
            callback: event => {
                const {user} = this.props, {chatsMap} = this.state,
                    {removedChat} = event.detail, isRelated = chatsMap.has(removedChat.id);
                if (isRelated) {
                    Promise.resolve(user)
                        .then(user => {
                            const localChat = chatsMap.get(removedChat.id),
                                showToast = user.id === removedChat.fellow.id;
                            if (showToast) {
                                CustomEvents.fire({
                                    eventName: ToastEvents.SHOW,
                                    detail: {
                                        icon: "notification",
                                        level: "error",
                                        message: <span><b>{localChat.fellow.name}</b> removed chat with you</span>
                                    }
                                });
                            }
                        })
                        .then(_ => {
                            if (this.isSelectedChat(removedChat)) {
                                CustomEvents.fire({
                                    eventName: Events.CHAT.SELECT,
                                    detail: {selectedChat: null}
                                });
                            }
                        })
                        .then(this.handleLoadChats);
                }
            }
        });

        CustomEvents.register({
            eventName: Events.CHAT.CLEAR,
            callback: event => {
                const {user} = this.props, {chatsMap} = this.state,
                    {clearedChat} = event.detail, isRelated = chatsMap.has(clearedChat.id);
                if (isRelated) {
                    Promise.resolve(user)
                        .then(user => {
                            const localChat = chatsMap.get(clearedChat.id),
                                showToast = user.id === clearedChat.fellow.id;
                            if (showToast) {
                                CustomEvents.fire({
                                    eventName: ToastEvents.SHOW,
                                    detail: {
                                        message:
                                            <span><b>{localChat.fellow.name}</b> has just cleared chat history</span>
                                    }
                                });
                            }
                        })
                        .then(_ => {
                            const localChat = chatsMap.get(clearedChat.id);
                            localChat.latestMessageDate = null;
                            chatsMap.set(localChat.id, localChat);
                            this.setState({
                                chatsMap: chatsMap
                            })
                        });
                }
            }
        });

        CustomEvents.register({
            eventName: Events.CHAT.SELECT,
            callback: event => {
                const {selectedChat} = event.detail;
                SessionStorage.setItem({key: SessionEntities.ACTIVE_CHAT, value: selectedChat});
                this.setState({selectedChat: selectedChat});
            }
        });

        CustomEvents.register({
            eventName: Events.MESSAGE.ADD,
            callback: event => {
                const {chatsMap} = this.state, {message} = event.detail, {relation, date} = message,
                    isRelated = chatsMap.has(relation.id);
                if (isRelated) {
                    const relatedChat = chatsMap.get(relation.id);
                    Promise.resolve(relatedChat)
                        .then(relatedChat => {
                            if (!this.isSelectedChat(relatedChat)) {
                                Notifier.notify({
                                    title: `New message from ${relatedChat.fellow.name}`,
                                    text: message.body,
                                    onclick: _ => CustomEvents.fire({
                                        eventName: Events.CHAT.SELECT,
                                        detail: {selectedChat: relatedChat}
                                    })
                                });
                            }
                            return relatedChat;
                        })
                        .then(relatedChat => {
                            relatedChat.latestMessageDate = date;
                            chatsMap.set(relatedChat.id, relatedChat);
                            return ChattingService.sortChats(chatsMap);
                        })
                        .then(chatsMap => this.setState({
                            chatsMap: chatsMap
                        }));
                }
            }
        });

        // 'Escape' button;
        KeyEvents.register({
            eventName: 'keydown',
            handler: event => {
                event = event || window.event;
                if (event.keyCode === 27) {
                    CustomEvents.fire({
                        eventName: Events.CHAT.SELECT,
                        detail: {selectedChat: null}
                    });
                }
            }
        });
    }

    componentDidMount() {
        CustomEvents.fire({eventName: Events.CHAT.LOAD_ALL});

        Notifier.requestPermission();

        const activeChat = SessionStorage.getItem(SessionEntities.ACTIVE_CHAT);
        if (!!activeChat) {
            CustomEvents.fire({eventName: Events.CHAT.SELECT, detail: {selectedChat: activeChat}});
        }
    }

    handleLoadChats = _ => {
        ChattingService.loadChatsMap()
            .then(chatsMap => this.setState(
                {chatsMap: chatsMap},
                _ => {
                    CustomEvents.fire({
                        eventName: Events.CHAT.CALCULATE,
                        detail: chatsMap.size || 0
                    })
                }));
    };

    isSelectedChat = chat => {
        const {selectedChat} = this.state;
        return !!selectedChat && !!chat && selectedChat.id === chat.id;
    };

    render() {
        let {chatsMap} = this.state, chatsArray = Array.from(chatsMap.values());
        const chats = chatsArray.map(chat =>
            <ChatItem key={chat.id} data={chat} selected={this.isSelectedChat(chat)}/>);
        return (
            <div className="slds-scrollable_y height-inherit">
                {chats.length === 0
                    ? <EmptyArea title="There are no chats for now"
                                 className="height-inherit" icon="utility:comments"/>
                    : <div className="slds-text-longform">{chats}</div>}
                <div className="slds-align_absolute-center position-bottom">
                    <TrashContainer/>
                </div>
            </div>
        );
    }
}

const chatItemTarget = {
    drop(props, monitor) {
        return {chatItem: monitor.getItem()};
    }
};

@DropTarget(ItemTypes.CHAT, chatItemTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget()
}))
class TrashContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDragged: false
        };
    }

    componentDidMount() {
        CustomEvents.register({
            eventName: DnDEvents.DELETE_CHAT_DRAG, callback: _ => this.setState({isDragged: true})
        });
        CustomEvents.register({
            eventName: DnDEvents.DELETE_CHAT_DROP, callback: _ => this.setState({isDragged: false})
        });
    }

    render() {
        const {connectDropTarget} = this.props, {isDragged} = this.state;
        return connectDropTarget(
            <div className={Utility.join("trash-container", isDragged ? "shake" : "slds-hide")}>
                <Icon icon="action:delete" size="large"/>
            </div>
        );
    }
}

export default ChatsTab;