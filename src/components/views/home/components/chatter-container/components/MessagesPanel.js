import React from "react";
import Events from "../../../../../../model/events/application-events";

import {Icon, Spinner} from "react-lightning-design-system";
import {CustomEvents} from "../../../../../../model/services/utility/EventsService";
import {ChattingService} from "../../../../../../model/services/core/ChattingService";
import {Utility} from "../../../../../../model/services/utility/UtilityService";

class MessagesPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chat: null,
            messagesMap: new Map(),
            loading: false
        }
    }

    componentWillMount() {
        CustomEvents.register({
            eventName: Events.CHAT.SELECT,
            callback: event => {
                const {selectedChat} = event.detail;
                if (!!selectedChat) this.handleLoadMessages(selectedChat);
            }
        });

        CustomEvents.register({
            eventName: Events.CHAT.CLEAR,
            callback: event => {
                let {clearedChat} = event.detail, {chat} = this.state;
                if (!!clearedChat && !!chat && clearedChat.id === chat.id) {
                    this.setState({messagesMap: new Map()});
                }
            }
        });

        CustomEvents.register({
            eventName: Events.MESSAGE.ADD,
            callback: event => {
                const {chat} = this.state, {message} = event.detail;
                if (!!chat && chat.id === message.relation.id) {
                    const entry = this.parseMessageItem(message), {messagesMap} = this.state;
                    if (!messagesMap.has(entry.id)) {
                        messagesMap.set(entry.id, entry);
                        this.setState({messagesMap: messagesMap});
                    }
                }
            }
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (!!this._container) {
            this._container.scrollTop = this._container.scrollHeight;
        }
    }

    handleLoadMessages = (chat) => {
        this.setState({loading: true});
        Promise.resolve(chat)
            .then(chat => {
                return !!chat
                    ? ChattingService.loadMessagesMap({chat: chat, itemCallback: this.parseMessageItem})
                    : Promise.reject("Empty chat selected.");
            })
            .then(messagesMap => ({chat: chat, messagesMap: messagesMap}),
                _ => ({chat: null, messagesMap: new Map()}))
            .then(state => {
                state.loading = false;
                this.setState(state)
            });
    };

    parseMessageItem = (message) => {
        const messageEntry = Object.assign({}, message), {user} = this.props;
        messageEntry.date = Utility.formatDate({dateNum: message.date});
        messageEntry.isInbound = message.author.id !== user.id;
        return messageEntry;
    };

    render() {
        const {chat, messagesMap, loading} = this.state,
            messageItems = Array.from(messagesMap.values()).map(message => {
                return message.isInbound
                    ? <InboundMessage key={message.id} message={message}/>
                    : <OutboundMessage key={message.id} message={message}/>;
            });
        return (
            <div className="slds-card__body messages-container">
                <section role="log" className="slds-chat height-percent-100">
                    {loading && <Spinner/>}
                    <ul className="slds-chat-list slds-scrollable_y" ref={element => this._container = element}>
                        <ChatTitle chat={chat}/>
                        {messageItems}
                    </ul>
                </section>
            </div>
        );
    }
}

const ChatTitle = ({chat}) => {
    return (
        <li className="slds-chat-listitem slds-chat-listitem_bookend">
            <div className="slds-chat-bookend">
                <span className="slds-icon_container slds-icon-utility-chat slds-chat-icon">
                    <Icon icon="utility:chat" size="small"/>
                </span>
                <p>Chat started by <b>{!!chat && chat.startedBy.name}</b></p>
            </div>
        </li>
    );
};

const OutboundMessage = ({message}) => {
    return (
        <li className="slds-chat-listitem slds-chat-listitem_outbound">
            <div className="slds-chat-message">
                <div className="slds-chat-message__body">
                    <div className="slds-chat-message__text slds-chat-message__text_outbound">
                        <span>{message.body}</span>
                    </div>
                    <div className="slds-chat-message__meta slds-float_right"
                         aria-label={message.date}>{message.date}</div>
                </div>
            </div>
        </li>
    );
};

const InboundMessage = ({message}) => {
    return (
        <li className="slds-chat-listitem slds-chat-listitem_inbound">
            <div className="slds-chat-message">
                <div className="slds-chat-message__body">
                    <div className="slds-chat-message__text slds-chat-message__text_inbound">
                        <span>{message.body}</span>
                    </div>
                    <div className="slds-chat-message__meta slds-float_left"
                         aria-label={message.date}>{message.date}</div>
                </div>
            </div>
        </li>
    );
};

export default MessagesPanel;