import React from "react";
import MaskedInput from "../../../../common/components/inputs/MaskedInput";
import PasswordInput from "../../../../common/components/inputs/PasswordInput";
import ToastEvents from "../../../../common/components/toasts/events";
import GmailService from "../../../../../model/services/core/GmailService";
import Button from "@salesforce/design-system-react/module/components/button";
import Spinner from "@salesforce/design-system-react/module/components/spinner";
import InputIcon from "@salesforce/design-system-react/module/components/icon/input-icon";

import {LoginService} from "../../../../../model/services/core/AuthenticationService";
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
                LoginService.loginUser({
                    username: inputs.username,
                    password: inputs.password
                }).catch(errorMessage => {
                    inputs.password = "";
                    this.setState({loading: false, inputs: inputs, error: errorMessage}, _ => {
                        CustomEvents.fire({
                            eventName: ToastEvents.SHOW,
                            detail: {level: "error", message: errorMessage}
                        });
                    });
                });
            });
        } else {
            CustomEvents.fire({
                eventName: ToastEvents.SHOW,
                detail: {level: "warning", message: "Credentials required."}
            });
        }
    };

    handleLoginViaGmail = _ => {
        // Initiate OAuth flow;
        this.setState({loading: true, error: ""}, _ => {
            GmailService.requestTokenUrl()
                .then(url => Navigation.toCustom({url: url, replace: true}))
                .catch(e => {
                    this.setState({loading: false});
                    console.error(JSON.stringify(e));
                });
        });
    };

    isFormFulfilled = _ => {
        const {inputs} = this.state;
        if (!Utility.matches(inputs.username, InputPatterns.LOGIN)) return false;
        return Utility.matches(inputs.password, InputPatterns.PASSWORD);
    };

    render() {
        const {loading, inputs, error} = this.state, {onSwitchForm} = this.props;
        return (
            <form onSubmit={this.handleLogin} className={`slds-form--stacked ${!!error && "slds-has-error"}`}>
                <MaskedInput label="Login" required
                             iconRight={<InputIcon name="user" category="utility"/>}
                             pattern={InputPatterns.LOGIN}
                             disabled={loading}
                             value={inputs.username}
                             onChange={val => {
                                 inputs.username = val;
                                 this.setState({inputs});
                             }}/>
                <PasswordInput disabled={loading}
                               value={inputs.password}
                               onChange={val => {
                                   inputs.password = val;
                                   this.setState({inputs});
                               }}/>
                <div className="slds-clearfix slds-m-top_small">
                    <div className={`slds-float_left ${loading && "slds-hide"}`}>
                        <Button variant="brand" onClick={this.handleLogin}>Login</Button>
                        <Button variant="destructive" onClick={this.handleLoginViaGmail}>Login via Gmail</Button>
                    </div>
                    <div className="slds-float_right">
                        <Button variant="base" onClick={onSwitchForm}
                                className={`${loading && "slds-hide"}`}>Register</Button>
                    </div>
                    <div className="slds-float_left slds-is-relative slds-p-vertical--medium slds-p-left_large">
                        {loading && <Spinner variant="brand" size="small"/>}
                    </div>
                </div>
            </form>
        );
    }
}

export default Login;