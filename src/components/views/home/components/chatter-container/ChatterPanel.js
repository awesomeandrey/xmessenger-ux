import React from "react";
import HeaderPanel from "./components/HeaderPanel";
import MessagesPanel from "./components/MessagesPanel";
import MessageInput from "./components/MessageInput";
import EmptyArea from "../../../../common/components/utils/EmptyArea";
import Events from "../../../../../model/application-events";
import AppContext from "../../../../../model/services/context/AppContext";

import {CustomEvents} from "../../../../../model/services/utility/EventsService";

import "./styles/styles.css";

class ChatterPanel extends React.Component {
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
                this.setState({selectedChat});
            }
        });
    }

    render() {
        const {selectedChat} = this.state, hasSelectedChat = !!selectedChat,
            placeholder = hasSelectedChat && `Message ${selectedChat.fellow.name}`;
        return (
            <div className="height-inherit">
                <EmptyArea title="Select chat from the list" icon="comments"
                           className={`height-inherit slds-theme_shade slds-box slds-theme_alert-texture
                            ${hasSelectedChat && "slds-hide"}`}/>
                <AppContext.Consumer>
                    {context => (
                        <div className={`height-inherit theme-marker--border slds-card ${!hasSelectedChat && "slds-hide"}`}>
                            <div className="slds-p-around--medium slds-m-bottom--none theme-marker">
                                <HeaderPanel chat={selectedChat}/>
                            </div>
                            <div className="messages-container">
                                <MessagesPanel user={context.user}/>
                            </div>
                            <div className="message-input theme-marker position-bottom">
                                <MessageInput chat={selectedChat} placeholder={placeholder}/>
                            </div>
                        </div>
                    )}
                </AppContext.Consumer>
            </div>
        );
    }
}

export default ChatterPanel;