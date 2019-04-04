import React from "react";
import MaskedInput from "../../../../common/components/inputs/MaskedInput";
import PasswordInput from "../../../../common/components/inputs/PasswordInput";
import ToastEvents from "../../../../common/components/toasts/events";

import {Button, Form, Spinner} from "react-lightning-design-system";
import {LoginService} from "../../../../../model/services/core/AuthenticationService";
import {OAuthService} from "../../../../../model/services/core/GmailService";
import {InputPatterns, Utility} from "../../../../../model/services/utility/UtilityService";
import {Navigation} from "../../../../../model/services/utility/NavigationService";
import {CustomEvents} from "../../../../../model/services/utility/EventsService";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: "",
            inputs: {
                username: "",
                password: ""
            }
        };
    }

    handleLogin = _ => {
        if (this.isFormFulfilled()) {
            this.setState({loading: true, error: ""}, _ => {
                const {inputs} = this.state;
                LoginService.login({
                    username: inputs.username,
                    password: inputs.password
                }).then(_ => {
                    Navigation.toHome({});
                }, errorMessage => {
                    inputs.password = "";
                    this.setState({loading: false, inputs: inputs, error: errorMessage}, _ => {
                        CustomEvents.fire({
                            eventName: ToastEvents.SHOW,
                            detail: {icon: "notification", level: "error", message: errorMessage}
                        });
                    });
                });
            });
        } else {
            CustomEvents.fire({
                eventName: ToastEvents.SHOW,
                detail: {icon: "warning", level: "warning", message: "Credentials required."}
            });
        }
    };

    handleLoginViaGmail = _ => {
        // Initiate OAuth flow;
        this.setState({loading: true, error: ""}, _ => {
            OAuthService.requestTokenUrl()
                .then(url => Navigation.toCustom({url: url, replace: true}))
                .catch(e => {
                    this.setState({loading: false});
                    console.error(JSON.stringify(e));
                });
        });
    };

    isFormFulfilled = _ => {
        const {inputs} = this.state;
        if (!Utility.check(inputs.username, InputPatterns.LOGIN)) return false;
        return Utility.check(inputs.password, InputPatterns.PASSWORD);
    };

    render() {
        const {loading, inputs, error} = this.state, {onSwitchForm} = this.props;
        return (
            <Form onSubmit={this.handleLogin} className={`${!!error && "slds-has-error"}`}>
                <MaskedInput label="Login"
                             iconRight="user" required
                             pattern={InputPatterns.LOGIN}
                             disabled={loading}
                             value={inputs.username}
                             onChange={val => {
                                 inputs.username = val;
                                 this.setState({inputs})
                             }}/>
                <PasswordInput disabled={loading}
                               value={inputs.password}
                               onChange={val => {
                                   inputs.password = val;
                                   this.setState({inputs})
                               }}/>
                <div className={`slds-clearfix ${loading && "slds-hide"}`}>
                    <div className="slds-float_left flex-container">
                        <Button type="brand" onClick={this.handleLogin}>Login</Button>
                        <Button type="destructive" onClick={this.handleLoginViaGmail}>Login via Gmail</Button>
                    </div>
                    <div className="slds-float_right">
                        <Button onClick={onSwitchForm}>Register</Button>
                    </div>
                </div>
                {loading && <div className="slds-float_left slds-is-relative slds-p-around_small slds-p-left_medium">
                    <Spinner type="brand" container={false}/>
                </div>}
            </Form>
        );
    }
}

export default Login;