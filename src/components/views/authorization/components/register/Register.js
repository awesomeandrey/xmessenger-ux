import React from 'react';
import FieldDefinition from "../../../../common/model/FieldDefinition";
import UsernameInput from "./UsernameInput";

import {LoginService, RegistrationService} from "../../../../../model/services/core/AuthenticationService";
import {Button, Input, Spinner} from "react-lightning-design-system";
import {InputPatterns} from "../../../../../model/services/utility/UtilityService";
import {Navigation} from "../../../../../model/services/utility/NavigationService";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            inputs: {
                name: Object.create(null),
                username: Object.create(null),
                password: Object.create(null),
                repeatedPassword: Object.create(null)
            }
        };
    }

    componentDidMount() {
        this._password.type = "password";
        this._repeatedPassword.type = "password";

        // Instantiate fieldDef entities;
        let inputFields = Object.create(null);
        [
            new FieldDefinition("", {name: "name", pattern: InputPatterns.NAME}),
            new FieldDefinition("", {name: "username", pattern: InputPatterns.LOGIN}),
            new FieldDefinition("", {name: "password", pattern: InputPatterns.PASSWORD}),
            new FieldDefinition("", {name: "repeatedPassword", pattern: InputPatterns.PASSWORD})
        ].forEach(inputField => {
            Object.defineProperty(inputFields, inputField.name, {
                value: inputField, writable: true
            });
        });
        this.setState({inputs: inputFields});
    }

    handleRegister = _ => {
        this.setState({loading: true});
        const {inputs} = this.state;
        if (this.isFormFulfilled()) {
            const rawCredentials = {
                username: inputs.username.value,
                password: inputs.password.value
            }, userToRegister = {
                name: inputs.name.value, ...rawCredentials
            };
            RegistrationService.register(userToRegister)
                .then(_ => LoginService.login(rawCredentials))
                .then(_ => Navigation.toHome({}));
        } else {
            Object.getOwnPropertyNames(inputs).forEach(p => {
                if (!inputs[p].matchesPattern()) {
                    inputs[p].error = inputs[p].pattern.errorMessage;
                }
            });
            this.setState({loading: false, inputs: inputs});
        }
    };

    handleChangeInput = (event, fieldDef) => {
        const {inputs} = this.state, inputName = fieldDef.name;
        if (!!inputs[inputName]) {
            fieldDef.value = event.target.value;
            inputs[inputName] = fieldDef;
            this.setState({inputs: inputs});
        }
    };

    isFormFulfilled = _ => {
        let allInputsMatchPattern = true;
        const {inputs} = this.state;
        Object.getOwnPropertyNames(inputs).forEach(propName => {
            if (!inputs[propName].matchesPattern()) {
                allInputsMatchPattern = false;
            }
        });
        if (!allInputsMatchPattern) return false;
        if (!!inputs.username.error) return false;
        if (inputs.password.value !== inputs.repeatedPassword.value) return false;
        return true;
    };

    render() {
        const {loading, inputs} = this.state, {onSwitchForm} = this.props;
        return (
            <div className="slds-form--horizontal">
                <Input label="Your Name"
                       placeholder="Type here..."
                       value={inputs.name.value}
                       onChange={e => this.handleChangeInput(e, inputs.name)}
                       error={inputs.name.error}
                       disabled={loading} required/>
                <UsernameInput title="Choose username"
                               fieldDef={inputs.username}
                               onChange={updatedFieldDef => {
                                   inputs[updatedFieldDef.name] = updatedFieldDef;
                                   this.setState({inputs: inputs});
                               }}
                               disabled={loading}/>
                <Input label="Password"
                       placeholder="Type here..."
                       inputRef={el => this._password = el}
                       value={inputs.password.value}
                       onChange={e => this.handleChangeInput(e, inputs.password)}
                       error={inputs.password.error}
                       disabled={loading} required/>
                <Input label="Confirm password"
                       placeholder="Type here..."
                       inputRef={el => this._repeatedPassword = el}
                       value={inputs.repeatedPassword.value}
                       onChange={event => {
                           inputs.repeatedPassword.value = event.target.value;
                           if (!inputs.password.matchesPattern()) {
                               inputs.repeatedPassword.value = "";
                               inputs.repeatedPassword.error = "Password is not confirmed";
                           } else if (inputs.password.value !== inputs.repeatedPassword.value) {
                               inputs.repeatedPassword.error = "Password is not confirmed";
                           } else {
                               inputs.repeatedPassword.error = "";
                           }
                           this.setState({inputs: inputs});
                       }}
                       error={inputs.repeatedPassword.error}
                       disabled={loading} required/>
                <div className="slds-form-element__control slds-m-top_small">
                    <div className={`slds-clearfix ${loading && "slds-hide"}`}>
                        <div className="slds-float_left">
                            <Button type="neutral" onClick={this.handleRegister}>Register</Button>
                        </div>
                        <div className="slds-float_right">
                            <Button onClick={onSwitchForm}>Back to Login</Button>
                        </div>
                    </div>
                    {loading && <div className="slds-float_left slds-is-relative slds-p-around_small slds-p-left_medium">
                        <Spinner type="brand" container={false}/>
                    </div>}
                </div>
            </div>
        );
    }
}

export default Register;