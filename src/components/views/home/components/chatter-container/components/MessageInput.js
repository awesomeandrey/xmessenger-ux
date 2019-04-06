import React from "react";
import DynamicInput from "../../../../../common/components/inputs/DynamicInput";

import {Button} from "react-lightning-design-system";
import {ChattingService} from "../../../../../../model/services/core/ChattingService";
import {Utility, InputPatterns} from "../../../../../../model/services/utility/UtilityService";

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
                ChattingService.sendMessage({chat, messageBody}).then(_ => {
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
            <footer className="theme-marker slds-card__footer slds-theme_shade position-bottom message-input">
                <form onSubmit={this.handleSendMessage} className="flex-container flex-container__stretch">
                    <div className="flex-item__grow">
                        <DynamicInput loading={loading} error={error} onChange={this.handleTypeIn}
                                      ref={component => this._dynamicInputComponent = component}/>
                    </div>
                    <div className="slds-is-relative">
                        <Button type="neutral" disabled={loading} onClick={this.handleSendMessage}
                                className="slds-m-left--x-small mobile-hidden">SEND</Button>
                    </div>
                </form>
            </footer>
        );
    }
}

export default MessageInput;