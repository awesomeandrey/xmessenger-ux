import React from "react";

import {Input, Spinner, Textarea} from "react-lightning-design-system";
import {Utility} from "../../../../model/services/utility/UtilityService";

class DynamicInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.state = {
            value: "", multiModeEnabled: false
        };
    }

    handleChange(event) {
        if (!(event.ctrlKey && event.keyCode === 13)) {
            const inputValue = event.target.value.trim(), customHandler = this.props.onChange;
            if (!!customHandler && typeof customHandler === "function") {
                customHandler(inputValue);
            }
            this.setState({value: inputValue});
        }
    }

    handleKeyDown(event) {
        if (event.ctrlKey && event.keyCode === 13 && !Utility.isMobileDevice()) {
            this.setState({multiModeEnabled: true}, this.focus);
        }
    }

    clear() {
        this.setState({value: "", multiModeEnabled: false});
    }

    focus() {
        const {multiModeEnabled} = this.state;
        if (multiModeEnabled) {
            this._textareaElement.focus();
        } else {
            this._inputElement.focus();
        }
    }

    render() {
        const {value, multiModeEnabled} = this.state, {loading = false, error} = this.props;
        return (
            <div className="slds-form-element">
                <div className="slds-form-element__control slds-input-has-icon slds-text-title">
                    {!multiModeEnabled && <Input placeholder="Type here..."
                                                 inputRef={el => this._inputElement = el}
                                                 value={value}
                                                 disabled={loading}
                                                 error={error}
                                                 onKeyDown={this.handleKeyDown}
                                                 onChange={this.handleChange}/>}
                    {multiModeEnabled && <Textarea placeholder="Type here..."
                                                   textareaRef={el => this._textareaElement = el}
                                                   value={value}
                                                   disabled={loading}
                                                   error={error}
                                                   rows={3}
                                                   onChange={this.handleChange}/>}
                    <div className="slds-input__icon-group slds-input__icon-group_right">
                        {loading && <Spinner type="brand" className="slds-input__spinner"/>}
                    </div>
                </div>
            </div>
        );
    }
}

export default DynamicInput;