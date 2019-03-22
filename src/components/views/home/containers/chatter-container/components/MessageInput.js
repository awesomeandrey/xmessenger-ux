import React from "react";
import DynamicInput from "../../../../../common/components/inputs/DynamicInput";

import {Button} from "react-lightning-design-system";
import {ChattingService} from "../../../../../../model/services/core/ChattingService";
import {Utility, InputPatterns} from "../../../../../../model/services/utility/UtilityService";

import "../styles/styles.css";

class MessageInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleTypeIn = this.handleTypeIn.bind(this);
        this.handleSendMessage = this.handleSendMessage.bind(this);
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
        const prevChat = prevProps.chat, chat = this.props.chat;
        if (prevChat !== chat) {
            this._dynamicInputComponent.clear();
            this.setState({messageBody: "", loading: false, error: ""});
        }
    }

    handleTypeIn(message) {
        if (Utility.check(message, InputPatterns.MESSAGE_BODY)) {
            this.setState({messageBody: message, error: ""});
        } else {
            this.setState({messageBody: message, error: InputPatterns.MESSAGE_BODY.errorMessage});
        }
    }

    handleSendMessage(event) {
        event.preventDefault();
        Promise.resolve(this.state.messageBody)
            .then(message => {
                this.setState({loading: true});
                if (Utility.check(message, InputPatterns.MESSAGE_BODY)) {
                    return Promise.resolve(message);
                } else {
                    return Promise.reject(InputPatterns.MESSAGE_BODY.errorMessage);
                }
            })
            .then(messageBody => {
                return ChattingService.sendMessage({
                    chat: this.props.chat,
                    messageBody: messageBody
                }).then(_ => {
                    this._dynamicInputComponent.clear();
                    this.setState({messageBody: "", loading: false, error: ""});
                })
            }, error => {
                this.setState({loading: false, error: error});
            });
    }

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
                        {!Utility.isMobileDevice()
                        && <Button type="neutral" disabled={loading} onClick={this.handleSendMessage}
                                   className="slds-m-left--x-small">SEND</Button>}
                    </div>
                </form>
            </footer>
        );
    }
}

export default MessageInput;