import React from "react";
import HeaderPanel from "./components/HeaderPanel";
import MessagesPanel from "./components/MessagesPanel";
import MessageInput from "./components/MessageInput";
import EmptyArea from "../../../../common/components/utils/EmptyArea";
import Events from "../../model/HomePageEvents";

import {CustomEvents} from "../../../../../model/services/utility/EventsService";

class ChatContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedChat: null
        };
    }

    componentWillMount() {
        CustomEvents.register({
            eventName: Events.CHAT.SELECT,
            callback: event => {
                const {selectedChat} = event.detail;
                this.setState({selectedChat: selectedChat});
            }
        });
    }

    render() {
        const {selectedChat} = this.state, hasSelectedChat = !!selectedChat;
        return (
            <div className="height-inherit">
                <EmptyArea title="Select chat from the list" icon="utility:comments"
                           className={`height-inherit slds-theme_shade slds-box slds-theme_alert-texture
                            ${hasSelectedChat && "slds-hide"}`}/>
                <div className={`height-inherit theme-marker--border slds-card ${!hasSelectedChat && "slds-hide"}`}>
                    <HeaderPanel chat={selectedChat}/>
                    <MessagesPanel/>
                    <MessageInput chat={selectedChat}/>
                </div>
            </div>
        );
    }
}

export default ChatContainer;