import React from "react";
import Icon from "@salesforce/design-system-react/module/components/icon";
import Spinner from "@salesforce/design-system-react/module/components/spinner";

import {Utility} from "../../../../../../model/services/utility/UtilityService";

class MessagesPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidUpdate(prevProps, prevState) {
        if (!!this._container) {
            this._container.scrollTop = this._container.scrollHeight;
        }
    }

    render() {
        const {chat: selectedChat, messagesMap, loading, user: currentUser} = this.props,
            messageItems = Array.from(messagesMap.values()).map(message => {
                message.formattedDate = Utility.formatDate({dateNum: message["date"]});
                return message["author"]["id"] !== currentUser["id"]
                    ? <InboundMessage key={message["id"]} message={message}/>
                    : <OutboundMessage key={message["id"]} message={message}/>;
            });
        return (
            <section role="log" className="slds-chat height-percent-100">
                {loading && <Spinner variant="brand" size="small"
                                     containerClassName="slds-spinner_container_overridden"/>}
                <ul className="slds-chat-list slds-scrollable_y" ref={element => this._container = element}>
                    <ChatTitle chat={selectedChat}/>
                    {messageItems}
                </ul>
            </section>
        );
    }
}

const ChatTitle = ({chat}) => {
    return (
        <li className="slds-chat-listitem slds-chat-listitem_bookend">
            <div className="slds-chat-bookend">
                <span className="slds-icon_container slds-icon-utility-chat slds-chat-icon">
                    <Icon category="utility" name="chat" size="small"/>
                </span>
                <p>Chat started by <b>{!!chat && chat["startedBy"]["name"]}</b></p>
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
                        <span>{message["body"]}</span>
                    </div>
                    <div className="slds-chat-message__meta slds-float_right">{message.formattedDate}</div>
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
                        <span>{message["body"]}</span>
                    </div>
                    <div className="slds-chat-message__meta slds-float_left">{message.formattedDate}</div>
                </div>
            </div>
        </li>
    );
};

export default MessagesPanel;