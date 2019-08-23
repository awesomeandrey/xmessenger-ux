import React, {useRef, useEffect} from "react";
import Icon from "@salesforce/design-system-react/module/components/icon";

import {Utility} from "../../../../../../model/services/utility/UtilityService";

const MessagesPanel = props => {
    const container = useRef(null);

    useEffect(() => {
        if (!!container && !!container.current) {
            container.current["scrollTop"] = container.current["scrollHeight"];
        }
    });

    const {chat: selectedChat, messagesMap, user: currentUser} = props,
        messageItems = Array.from(messagesMap.values()).map(message => {
            message.formattedDate = Utility.formatDate({dateNum: message["date"]});
            return message["author"]["id"] !== currentUser["id"]
                ? <InboundMessage key={message["id"]} message={message}/>
                : <OutboundMessage key={message["id"]} message={message}/>;
        });
    return (
        <section role="log" className="slds-chat height-percent-100">
            <ul className="slds-chat-list slds-scrollable_y" ref={container}>
                <ChatTitle chat={selectedChat}/>
                {messageItems}
            </ul>
        </section>
    );
};

const ChatTitle = ({chat}) => {
    return (
        <li className="slds-chat-listitem slds-chat-listitem_bookend">
            <div className="slds-chat-bookend">
                <span className="slds-icon_container slds-icon-utility-chat slds-chat-icon">
                    <Icon category="utility" name="chat" size="small"/>
                </span>
                <p>Chat started by <b>{chat["startedBy"]["name"]}</b></p>
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