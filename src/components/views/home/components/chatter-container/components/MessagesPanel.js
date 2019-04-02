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
            selectedChat: null,
            messagesMap: new Map(),
            loading: false
        }
    }

    componentWillMount() {
        CustomEvents.register({
            eventName: Events.CHAT.SELECT,
            callback: event => {
                const {selectedChat} = event.detail, {selectedChat: localChat} = this.state;
                if ((!!selectedChat && !localChat) || (!!selectedChat && !!localChat && selectedChat.id !== localChat.id)) {
                    this.setState({selectedChat: selectedChat, loading: true}, _ => {
                        ChattingService.loadMessagesMap(selectedChat)
                            .then(messagesMap => this.setState({messagesMap: messagesMap, loading: false}));
                    });
                }
            }
        });

        CustomEvents.register({
            eventName: Events.CHAT.CLEAR,
            callback: event => {
                let {clearedChat} = event.detail, {selectedChat} = this.state;
                if (!!clearedChat && !!selectedChat && clearedChat.id === selectedChat.id) {
                    this.setState({messagesMap: new Map()});
                }
            }
        });

        CustomEvents.register({
            eventName: Events.MESSAGE.ADD,
            callback: event => {
                const {message} = event.detail, {selectedChat, messagesMap} = this.state;
                if (!!selectedChat && selectedChat.id === message.relation.id && !messagesMap.has(message.id)) {
                    messagesMap.set(message.id, message);
                    this.setState({messagesMap: messagesMap});
                }
            }
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (!!this._container) {
            this._container.scrollTop = this._container.scrollHeight;
        }
    }

    render() {
        const {chat, messagesMap, loading} = this.state, {user} = this.props,
            messageItems = Array.from(messagesMap.values()).map(message => {
                message.formattedDate = Utility.formatDate({dateNum: message.date});
                return message.author.id !== user.id
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
                         aria-label={message.formattedDate}>{message.formattedDate}</div>
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
                         aria-label={message.formattedDate}>{message.formattedDate}</div>
                </div>
            </div>
        </li>
    );
};

export default MessagesPanel;