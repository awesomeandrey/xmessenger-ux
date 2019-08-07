import React from 'react';
import MaskedInput from "../../../../common/components/inputs/MaskedInput";
import PasswordInput from "../../../../common/components/inputs/PasswordInput";
import StatefulInput from "../../../../common/components/inputs/StatefulInput";
import EmailInput from "../../../../common/components/inputs/EmailInput";
import ToastEvents from "../../../../common/components/toasts/toasts-events";
import Button from "@salesforce/design-system-react/module/components/button";
import Spinner from "@salesforce/design-system-react/module/components/spinner";
import InputIcon from "@salesforce/design-system-react/module/components/icon/input-icon";

import {LoginService, RegistrationService} from "../../../../../model/services/core/AuthenticationService";
import {InputPatterns, Utility} from "../../../../../model/services/utility/UtilityService";
import {CustomEvents} from "../../../../../model/services/utility/EventsService";
import {Navigation} from "../../../../../model/services/utility/NavigationService";

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
                repeatedPassword: "",
                email: ""
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
                if (!!inputs.email) {
                    userToRegister.email = inputs.email;
                }
                RegistrationService.register(userToRegister)
                    .then(_ => LoginService.loginUser(rawCredentials))
                    .then(_ => Navigation.toHome({replace: true}));
            });
        } else {
            inputs.password = "";
            inputs.repeatedPassword = "";
            this.setState({inputs, error: INVALID_INPUT}, _ => {
                CustomEvents.fire({
                    eventName: ToastEvents.SHOW, detail: {level: "error", message: INVALID_INPUT}
                });
            });
        }
    };

    isFormFulfilled = _ => {
        const {inputs} = this.state;
        if (!Utility.matches(inputs.name, InputPatterns.NAME)) return false;
        if (!Utility.matches(inputs.username, InputPatterns.LOGIN)) return false;
        if (!!inputs.email && !Utility.matches(inputs.email, InputPatterns.EMAIL)) return false;
        for (let key in [inputs.password, inputs.repeatedPassword]) {
            if (inputs.hasOwnProperty(key) && !Utility.matches(inputs[key], InputPatterns.PASSWORD)) return false;
        }
        return inputs.password === inputs.repeatedPassword;
    };

    render() {
        const {loading, inputs, error} = this.state, {onSwitchForm} = this.props;
        return (
            <div className="register-form slds-form--horizontal">
                <div className={`${!!error && "slds-has-error"}`}>
                    <MaskedInput label="Your Name"
                                 iconRight={<InputIcon name="user" category="utility"/>}
                                 value={inputs.name}
                                 disabled={loading} required
                                 pattern={InputPatterns.NAME}
                                 onChange={val => {
                                     inputs.name = val;
                                     this.setState({name});
                                 }}/>
                    <StatefulInput label="Choose username"
                                   iconRight={<InputIcon name="activity" category="utility"/>}
                                   disabled={loading} required
                                   promiseFunc={RegistrationService.checkUsername}
                                   pattern={InputPatterns.LOGIN}
                                   onChange={val => {
                                       inputs.username = val;
                                       this.setState({name});
                                   }}/>
                    <PasswordInput disabled={loading}
                                   value={inputs.password}
                                   onChange={val => {
                                       inputs.password = val;
                                       this.setState({inputs});
                                   }}/>
                    <PasswordInput label="Confirm password"
                                   disabled={loading}
                                   value={inputs.repeatedPassword}
                                   onChange={val => {
                                       inputs.repeatedPassword = val;
                                       this.setState({inputs});
                                   }}/>
                </div>
                <EmailInput label="Email address (optional)"
                            disabled={loading}
                            value={inputs.email}
                            onChange={val => {
                                inputs.email = val;
                                this.setState({inputs});
                            }}/>
                <div className="slds-form-element__control slds-m-top_small">
                    <div className="slds-clearfix">
                        <div className="slds-float_left">
                            <Button variant="neutral" onClick={this.handleRegister}
                                    className={`${loading && "slds-hide"}`}>Register</Button>
                        </div>
                        <div className="slds-float_right">
                            <Button onClick={onSwitchForm} variant="base"
                                    className={`${loading && "slds-hide"}`}>Back to Login</Button>
                        </div>
                        <div className="slds-float_left slds-is-relative slds-p-around_small slds-p-left_medium">
                            {loading && <Spinner variant="brand" size="small"/>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Register;