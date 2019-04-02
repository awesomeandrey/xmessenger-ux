import React from "react";

import {Utility} from "../../../../../model/services/utility/UtilityService";
import {Spinner} from "react-lightning-design-system";
import {RegistrationService} from "../../../../../model/services/core/AuthenticationService";

class UsernameInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };
    }

    handleChange = (event) => {
        this.setState({loading: true});
        const {fieldDef, onChange} = this.props;
        fieldDef.value = event.target.value;
        if (!fieldDef.matchesPattern()) {
            fieldDef.error = fieldDef.pattern.errorMessage;
            this.setState({loading: false}, _ => {
                onChange(fieldDef);
            });
            return;
        }
        fieldDef.error = fieldDef.pattern.errorMessage;
        RegistrationService.checkUsername(fieldDef.value)
            .then(response => {
                const {errorMessage} = response;
                fieldDef.error = errorMessage;
                this.setState({loading: false}, _ => {
                    onChange(fieldDef);
                });
            });
    };

    render() {
        const {disabled, fieldDef, title} = this.props, {error} = fieldDef, {loading} = this.state;
        return (
            <div className={Utility.join("slds-form-element", !!error ? "slds-has-error" : "")}>
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
                <div className={`slds-form-element__help ${!fieldDef.changed && "slds-hide"}`}>
                    {!!error
                        ? <span className="slds-text-color_error">{error}</span>
                        : <span className="slds-text-color_success">Correct!</span>}
                </div>
            </div>
        );
    }
}

export default UsernameInput;