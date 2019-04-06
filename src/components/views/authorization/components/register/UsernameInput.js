import React from "react";

import {InputPatterns, Utility} from "../../../../../model/services/utility/UtilityService";
import {Spinner} from "react-lightning-design-system";
import {RegistrationService} from "../../../../../model/services/core/AuthenticationService";

class UsernameInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: "",
            changed: false
        };
    }

    handleChange = (event) => {
        const inputValue = event.target.value, pattern = InputPatterns.LOGIN, {onChange} = this.props;
        if (!Utility.matches(inputValue, pattern)) {
            this.setState({changed: true, error: pattern.errorMessage}, onChange);
        } else {
            this.setState({changed: true, error: "", loading: true});
            RegistrationService.checkUsername(inputValue)
                .then(response => {
                    const {valid, errorMessage} = response;
                    this.setState({loading: false, error: errorMessage}, _ => {
                        onChange(valid ? inputValue : "")
                    });
                });
        }
    };

    render() {
        const {disabled, label} = this.props, {loading, error, changed} = this.state;
        return (
            <div className={Utility.join("slds-form-element", !!error ? "slds-has-error" : "")}>
                <label className="slds-form-element__label">
                    {label}<abbr className="slds-required" title="required">*</abbr>
                </label>
                <div className="input__username slds-form-element__control slds-input-has-icon_group-right">
                    <input className="slds-input" placeholder="Type here..."
                           onChange={this.handleChange} disabled={disabled}/>
                    <div className="spinner slds-input__icon-group slds-input__icon-group_right slds-p-right--xx-large">
                        {loading && <Spinner type="brand" size="small" container={false}/>}
                    </div>
                </div>
                <div className={`slds-form-element__help ${(disabled || !changed) && "slds-hide"}`}>
                    {!!error && <span className="slds-text-color_error">{error}</span>}
                </div>
            </div>
        );
    }
}

export default UsernameInput;