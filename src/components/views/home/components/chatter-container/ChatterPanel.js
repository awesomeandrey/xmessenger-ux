import React from "react";
import HeaderPanel from "./components/HeaderPanel";
import MessagesPanel from "./components/MessagesPanel";
import MessageInput from "./components/MessageInput";
import EmptyArea from "../../../../common/components/utils/EmptyArea";
import ApplicationEvents from "../../../../../model/application-events";
import AppContext from "../../../../../model/services/context/AppContext";
import Spinner from "@salesforce/design-system-react/module/components/spinner";

import {ChattingService} from "../../../../../model/services/core/ChattingService";
import {CustomEvents} from "../../../../../model/services/utility/EventsService";
import {Utility} from "../../../../../model/services/utility/UtilityService";

import "./styles/styles.css";

const DEFAULT_STATE = {
    selectedChat: null,
    messagesMap: new Map(),
    loading: false
};

class ChatterPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = DEFAULT_STATE;
    }

    componentWillMount() {
        CustomEvents.register({
            eventName: ApplicationEvents.CHAT.SELECT,
            callback: event => {
                const {selectedChat} = event.detail, {selectedChat: localChat} = this.state;
                if (Utility.isMobileDevice() && !!selectedChat) {
                    // Adjustment for mobile devices;
                    Utility.scrollToBottom();
                }
                if (!!localChat && !selectedChat) {
                    this.setState(DEFAULT_STATE);
                } else if ((!!selectedChat && !localChat) || (!!selectedChat && !!localChat && selectedChat["chatId"] !== localChat["chatId"])) {
                    this.setState({selectedChat, loading: true}, _ => {
                        ChattingService.loadMessagesMap(selectedChat)
                            .then(messagesMap => this.setState({selectedChat, messagesMap, loading: false}));
                    });
                }
            }
        });
        CustomEvents.register({
            eventName: ApplicationEvents.CHAT.CLEAR,
            callback: event => {
                let {clearedChat} = event.detail, {selectedChat} = this.state;
                if (!!clearedChat && !!selectedChat && clearedChat["chatId"] === selectedChat["chatId"]) {
                    this.setState({messagesMap: new Map()});
                }
            }
        });
        CustomEvents.register({
            eventName: ApplicationEvents.MESSAGE.ADD,
            callback: event => {
                const {message} = event.detail, {selectedChat, messagesMap} = this.state;
                if (!!selectedChat && selectedChat["chatId"] === message["relation"]["id"] && !messagesMap.has(message["id"])) {
                    this.setState({messagesMap: messagesMap.set(message["id"], message)});
                }
            }
        });
    }

    render() {
        const {selectedChat, messagesMap, loading} = this.state;
        if (!selectedChat) {
            return (
                <div className="height-inherit">
                    <EmptyArea title="Select chat from the list" icon="comments"
                               className="height-inherit slds-theme_shade slds-box slds-theme_alert-texture"/>
                </div>
            );
        }
        return (
            <div className="height-inherit">
                <AppContext.Consumer>
                    {context => (
                        <div className={"height-inherit theme-marker--border slds-card "}>
                            <div className="slds-p-around--medium slds-m-bottom--none theme-marker">
                                <HeaderPanel chat={selectedChat}/>
                            </div>
                            <div className="messages-container">
                                {loading && <Spinner variant="brand" size="small"
                                                     containerClassName="slds-spinner_container_overridden"/>}
                                <MessagesPanel chat={selectedChat} user={context.user} messagesMap={messagesMap}/>
                            </div>
                            <div className="message-input theme-marker position-bottom">
                                <MessageInput chat={selectedChat}/>
                            </div>
                        </div>
                    )}
                </AppContext.Consumer>
            </div>
        );
    }
}

export default ChatterPanel;