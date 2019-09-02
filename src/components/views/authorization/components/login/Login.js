import React from "react";
import MaskedInput from "../../../../common/components/inputs/MaskedInput";
import PasswordInput from "../../../../common/components/inputs/PasswordInput";
import NotificationEvents from "../../../../common/components/notifications/notification-events";
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
            errorText: "",
            inputs: {
                username: "",
                password: ""
            }
        };
    }

    handleLogin = _ => {
        if (this.isFormFulfilled()) {
            this.setState({loading: true, errorText: ""}, _ => {
                const {inputs} = this.state;
                LoginService.loginUser(inputs).then(_ => Navigation.toHome({replace: true})).catch(error => {
                    inputs.password = "";
                    this.setState({loading: false, inputs, errorText: error.message}, _ => {
                        CustomEvents.fire({
                            eventName: NotificationEvents.SHOW, detail: {level: "error", message: error.message}
                        });
                    });
                });
            });
        } else {
            CustomEvents.fire({
                eventName: NotificationEvents.SHOW,
                detail: {level: "warning", message: "Credentials required."}
            });
        }
    };

    handleLoginViaGmail = _ => {
        // Initiate OAuth flow;
        this.setState({loading: true, errorText: ""}, _ => {
            GmailService.requestTokenUrl()
                .then(url => Navigation.toCustom({url, replace: true}))
                .catch(_ => this.setState({loading: false}));
        });
    };

    isFormFulfilled = _ => {
        const {inputs} = this.state;
        if (!Utility.matches(inputs.username, InputPatterns.LOGIN)) return false;
        return Utility.matches(inputs.password, InputPatterns.PASSWORD);
    };

    render() {
        const {loading, inputs, errorText} = this.state, {onSwitchForm} = this.props;
        return (
            <form onSubmit={this.handleLogin} className={`slds-form--stacked ${!!errorText && "slds-has-error"}`}>
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
                    <div
                        className={loading ? "slds-float_left slds-is-relative slds-p-vertical--medium slds-p-left_large" : "slds-hide"}>
                        <Spinner variant="brand" size="small"/>
                    </div>
                </div>
            </form>
        );
    }
}

export default Login;