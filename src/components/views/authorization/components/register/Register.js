import React from 'react';
import InputField from "../../../../common/wrappers/InputField";
import UniqueInputField from "../../../../common/wrappers/UniqueInputField";
import UsernameInput from "./UsernameInput";

import {LoginService, RegistrationService} from "../../../../../model/services/core/AuthenticationService";
import {Button, Input, Spinner} from "react-lightning-design-system";
import {InputPatterns} from "../../../../../model/services/utility/UtilityService";
import {Navigation} from "../../../../../model/services/utility/NavigationService";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);
        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.isFormFulfilled = this.isFormFulfilled.bind(this);
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

        // Instantiate field entities;
        let inputFields = Object.create(null);
        [
            new InputField("", {fieldName: "name", pattern: InputPatterns.NAME}),
            new UniqueInputField("", {fieldName: "username", pattern: InputPatterns.LOGIN}),
            new InputField("", {fieldName: "password", pattern: InputPatterns.PASSWORD}),
            new InputField("", {fieldName: "repeatedPassword", pattern: InputPatterns.PASSWORD})
        ].forEach(inputField => {
            Object.defineProperty(inputFields, inputField.fieldName, {
                value: inputField, writable: true
            });
        });
        this.setState({inputs: inputFields});
    }

    handleRegister() {
        this.setState({loading: true});
        const {inputs} = this.state;
        if (this.isFormFulfilled()) {
            const rawCredentials = {
                username: inputs.username.inputValue,
                password: inputs.password.inputValue
            }, userToRegister = {
                name: inputs.name.inputValue, ...rawCredentials
            };
            RegistrationService.register(userToRegister)
                .then(_ => LoginService.login(rawCredentials))
                .then(_ => Navigation.toHome({}));
        } else {
            Object.getOwnPropertyNames(inputs).forEach(p => {
                if (!inputs[p].matchesPattern()) {
                    inputs[p].errorMessage = inputs[p].pattern.errorMessage;
                }
            });
            this.setState({loading: false, inputs: inputs});
        }
    }

    handleChangeInput(event, inputField) {
        const {inputs} = this.state, propName = inputField.fieldName;
        if (!!inputs[propName]) {
            inputField.inputValue = event.target.value;
            inputs[propName] = inputField;
            this.setState({inputs: inputs});
        }
    }

    isFormFulfilled() {
        let allInputsMatchPattern = true;
        const {inputs} = this.state;
        Object.getOwnPropertyNames(inputs).forEach(propName => {
            if (!inputs[propName].matchesPattern()) {
                allInputsMatchPattern = false;
            }
        });
        if (!allInputsMatchPattern) return false;
        if (!inputs.username.unique) return false;
        if (inputs.password.inputValue !== inputs.repeatedPassword.inputValue) return false;
        return true;
    }

    render() {
        const {loading, inputs} = this.state;
        return (
            <div className="slds-form--horizontal">
                <Input label="Your Name"
                       placeholder="Type here..."
                       value={inputs.name.inputValue}
                       onChange={e => this.handleChangeInput(e, inputs.name)}
                       error={inputs.name.errorMessage}
                       disabled={loading} required/>
                <UsernameInput title="Choose username"
                               inputField={inputs.username}
                               onChange={updatedInputField => {
                                   inputs[updatedInputField.fieldName] = updatedInputField;
                                   this.setState({inputs: inputs});
                               }}
                               disabled={loading}/>
                <Input label="Password"
                       placeholder="Type here..."
                       inputRef={el => this._password = el}
                       value={inputs.password.inputValue}
                       onChange={e => this.handleChangeInput(e, inputs.password)}
                       error={inputs.password.errorMessage}
                       disabled={loading} required/>
                <Input label="Confirm password"
                       placeholder="Type here..."
                       inputRef={el => this._repeatedPassword = el}
                       value={inputs.repeatedPassword.inputValue}
                       onChange={event => {
                           const inputField = inputs.repeatedPassword;
                           inputField.inputValue = event.target.value;
                           if (inputField.inputValue !== inputs.password.inputValue) {
                               inputField.errorMessage = "Password is not confirmed";
                           }
                           inputs[inputField.fieldName] = inputField;
                           this.setState({inputs: inputs});
                       }}
                       error={inputs.repeatedPassword.errorMessage}
                       disabled={loading} required/>
                <div className="slds-form-element">
                    <div className="slds-form-element__control">
                        <div className="slds-float_left">
                            <Button className={loading ? "slds-hide" : "slds-show"}
                                    type="neutral" onClick={this.handleRegister}>Register</Button>
                            <div className={!loading ? "slds-hide" : "slds-show"}>
                                <div className="slds-is-relative slds-p-around_small slds-p-left_medium">
                                    <Spinner type="brand" container={false}/>
                                </div>
                            </div>
                        </div>
                        <div className="slds-float_right">
                            <Button className={loading ? "slds-hide" : "slds-show"}
                                    onClick={this.props.onSwitchForm}>Back to Login</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Register;