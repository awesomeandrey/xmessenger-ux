import React from "react";

import {Utility} from "../../../../../model/services/utility/UtilityService";
import {Spinner} from "react-lightning-design-system";
import {RegistrationService} from "../../../../../model/services/core/AuthenticationService";

class UsernameInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = {
            loading: false
        };
    }

    handleChange(event) {
        this.setState({loading: true});

        const {inputField, onChange} = this.props, inputValue = event.target.value;
        inputField.inputValue = inputValue;
        inputField.unique = false;

        if (!inputField.matchesPattern()) {
            onChange(inputField);
            this.setState({loading: false});
            return;
        }

        RegistrationService.checkUsernameForUniqueness(inputValue)
            .then(response => {
                let {valid} = response;
                inputField.unique = valid;
                inputField.errorMessage = valid ? "" : "Already in use. Try another one.";
                onChange(inputField);
                this.setState({loading: false})
            });
    }

    render() {
        const {disabled, inputField, title} = this.props, {loading} = this.state;
        const {errorMessage, unique} = inputField;
        return (
            <div className={Utility.join("slds-form-element", !!errorMessage ? "slds-has-error" : "")}>
                <label className="slds-form-element__label">
                    {title}<abbr className="slds-required" title="required">*</abbr>
                </label>
                <div className="slds-form-element__control slds-input-has-icon slds-input-has-icon_group-right">
                    <input className="slds-input" placeholder="Type here..."
                           onChange={this.handleChange} disabled={disabled}/>
                    <div className="slds-input__icon-group slds-input__icon-group_right">
                        {loading && <div className="slds-m-right--xx-large"><Spinner type="brand" size="small"/></div>}
                    </div>
                </div>
                <div className="slds-form-element__help">
                    {!!errorMessage && <span className="slds-text-color_error">{errorMessage}</span>}
                    {unique && <span className="slds-text-color_success">Correct!</span>}
                </div>
            </div>
        );
    }
}

export default UsernameInput;