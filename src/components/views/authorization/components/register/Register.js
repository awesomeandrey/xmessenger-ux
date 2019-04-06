import React from 'react';
import MaskedInput from "../../../../common/components/inputs/MaskedInput";
import PasswordInput from "../../../../common/components/inputs/PasswordInput";
import UsernameInput from "./UsernameInput";
import ToastEvents from "../../../../common/components/toasts/events";

import {LoginService, RegistrationService} from "../../../../../model/services/core/AuthenticationService";
import {Button, Spinner} from "react-lightning-design-system";
import {InputPatterns, Utility} from "../../../../../model/services/utility/UtilityService";
import {Navigation} from "../../../../../model/services/utility/NavigationService";
import {CustomEvents} from "../../../../../model/services/utility/EventsService";

import "../../styles/styles.css";

const INVALID_INPUT = "Incorrect input. Make sure that all fields are populated correctly.";

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: "",
            inputs: {
                name: "",
                username: "",
                password: "",
                repeatedPassword: ""
            }
        };
    }

    handleRegister = _ => {
        const {inputs} = this.state;
        if (this.isFormFulfilled()) {
            this.setState({loading: true, error: ""}, _ => {
                const rawCredentials = {
                    username: inputs.username,
                    password: inputs.password
                }, userToRegister = {
                    name: inputs.name, ...rawCredentials
                };
                RegistrationService.register(userToRegister)
                    .then(_ => LoginService.login(rawCredentials))
                    .then(_ => Navigation.toHome({}));
            });
        } else {
            inputs.password = "";
            inputs.repeatedPassword = "";
            this.setState({inputs, error: INVALID_INPUT}, _ => {
                CustomEvents.fire({
                    eventName: ToastEvents.SHOW, detail: {icon: "warning", level: "error", message: INVALID_INPUT}
                });
            });
        }
    };

    isFormFulfilled = _ => {
        const {inputs} = this.state;
        if (!Utility.check(inputs.name, InputPatterns.NAME)) return false;
        if (!Utility.check(inputs.username, InputPatterns.LOGIN)) return false;
        for (let key in [inputs.password, inputs.repeatedPassword]) {
            if (inputs.hasOwnProperty(key) && !Utility.check(inputs[key], InputPatterns.PASSWORD)) return false;
        }
        return inputs.password === inputs.repeatedPassword;
    };

    render() {
        const {loading, inputs, error} = this.state, {onSwitchForm} = this.props;
        return (
            <div className={`register-form slds-form--horizontal ${!!error && "slds-has-error"}`}>
                <MaskedInput label="Your Name"
                             iconRight="user"
                             value={inputs.name}
                             disabled={loading} required
                             pattern={InputPatterns.NAME}
                             onChange={val => {
                                 inputs.name = val;
                                 this.setState({name})
                             }}/>
                <UsernameInput label="Choose username"
                               disabled={loading} required
                               onChange={val => {
                                   inputs.username = val || "";
                                   this.setState({inputs: inputs});
                               }}/>
                <PasswordInput disabled={loading}
                               value={inputs.password}
                               onChange={val => {
                                   inputs.password = val;
                                   this.setState({inputs})
                               }}/>
                <PasswordInput label="Confirm password"
                               disabled={loading}
                               value={inputs.repeatedPassword}
                               onChange={val => {
                                   inputs.repeatedPassword = val;
                                   this.setState({inputs})
                               }}/>
                <div className="slds-form-element__control slds-m-top_small">
                    <div className="slds-clearfix">
                        <div className="slds-float_left">
                            <Button type="neutral" onClick={this.handleRegister}
                                    className={`${loading && "slds-hide"}`}>Register</Button>
                        </div>
                        <div className="slds-float_right">
                            <Button onClick={onSwitchForm} className={`${loading && "slds-hide"}`}>
                                Back to Login</Button>
                        </div>
                        <div className="slds-float_left slds-is-relative slds-p-around_small slds-p-left_medium">
                            {loading && <Spinner type="brand" container={false}/>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Register;