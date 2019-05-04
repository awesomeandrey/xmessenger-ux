import React from "react";
import DynamicInput from "../../../../../common/components/inputs/DynamicInput";
import Button from "@salesforce/design-system-react/module/components/button";
import ApplicationEvents from "../../../../../../model/events/application-events";

import {ChattingService} from "../../../../../../model/services/core/ChattingService";
import {Utility, InputPatterns} from "../../../../../../model/services/utility/UtilityService";
import {CustomEvents} from "../../../../../../model/services/utility/EventsService";

const pattern = InputPatterns.MESSAGE_BODY;

class MessageInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messageBody: "",
            error: false,
            loading: false
        };
    }

    componentDidUpdate(prevProps) {
        if (!!this._dynamicInputComponent) {
            this._dynamicInputComponent.focus();
        }
        const {chat: prevChat} = prevProps, {chat} = this.props;
        if (prevChat !== chat) {
            this._dynamicInputComponent.clear();
            this.setState({messageBody: "", loading: false, error: ""});
        }
    };

    handleTypeIn = (message) => this.setState({
        messageBody: message,
        error: Utility.matches(message, pattern) ? "" : pattern.errorMessage
    });

    handleSendMessage = (event) => {
        event.preventDefault();
        const {messageBody} = this.state, {chat} = this.props;
        if (Utility.matches(messageBody, pattern)) {
            this.setState({loading: true}, _ => {
                ChattingService.sendMessage({chat, messageBody})
                    .then(message => CustomEvents.fire({eventName: ApplicationEvents.MESSAGE.ADD, detail: {message}}))
                    .then(_ => {
                        this._dynamicInputComponent.clear();
                        this.setState({messageBody: "", loading: false, error: ""});
                    });
            });
        } else {
            this.setState({error: pattern.errorMessage});
        }
    };

    render() {
        const {loading, error} = this.state;
        return (
            <form onSubmit={this.handleSendMessage}
                  className="slds-p-around_small flex-container flex-container__stretch">
                <div className="flex-item__grow">
                    <DynamicInput loading={loading} error={error} onChange={this.handleTypeIn}
                                  ref={component => this._dynamicInputComponent = component}/>
                </div>
                <div className="slds-is-relative">
                    <Button variant="neutral" disabled={loading} onClick={this.handleSendMessage}
                            className="slds-m-left--x-small mobile-hidden">SEND</Button>
                </div>
            </form>
        );
    }
}

export default MessageInput;