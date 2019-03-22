import React from 'react';
import InputField from "../../../../common/wrappers/InputField";

import {Button, Form, Input, Spinner} from "react-lightning-design-system";
import {LoginService} from "../../../../../model/services/core/AuthenticationService";
import {OAuthService} from "../../../../../model/services/core/GmailService";
import {InputPatterns} from "../../../../../model/services/utility/UtilityService";
import {Navigation} from "../../../../../model/services/utility/NavigationService";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLoginViaGmail = this.handleLoginViaGmail.bind(this);
        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.isFormFulfilled = this.isFormFulfilled.bind(this);
        this.state = {
            loading: false,
            inputs: {
                username: Object.create(null),
                password: Object.create(null)
            }
        };
    }

    componentDidMount() {
        this._password.type = "password";

        // Instantiate field entities;
        let inputFields = Object.create(null);
        [
            new InputField("", {fieldName: "username", pattern: InputPatterns.LOGIN}),
            new InputField("", {fieldName: "password", pattern: InputPatterns.PASSWORD})
        ].forEach(inputField => {
            Object.defineProperty(inputFields, inputField.fieldName, {
                value: inputField, writable: true
            });
        });
        this.setState({inputs: inputFields});
    }

    handleLogin() {
        this.setState({loading: true});
        const {inputs} = this.state;
        if (this.isFormFulfilled()) {
            LoginService.login({
                username: inputs.username.inputValue,
                password: inputs.password.inputValue
            }).then(_ => {
                Navigation.toHome({});
            }, errorMessage => {
                inputs.username.errorMessage = errorMessage;
                inputs.password.inputValue = "";
                this.setState({loading: false, inputs: inputs});
            });
        } else {
            Object.getOwnPropertyNames(inputs).forEach(p => {
                if (!inputs[p].matchesPattern()) {
                    inputs[p].errorMessage = inputs[p].pattern.errorMessage;
                }
            });
            this.setState({loading: false, inputs: inputs});
        }
    }

    handleLoginViaGmail() {
        // Initiate OAuth flow;
        this.setState({loading: true});
        OAuthService.composeTokenUrl()
            .then(url => Navigation.toCustom({url: url, replace: true}))
            .catch(e => {
                this.setState({loading: false});
                console.error(JSON.stringify(e));
            });
    }

    handleChangeInput(event, inputField) {
        const {inputs} = this.state, propName = inputField.fieldName;
        if (!!inputs[propName]) {
            inputField.inputValue = event.target.value;
            Object.defineProperty(inputs, propName, {
                value: inputField
            });
            this.setState({inputs: inputs});
        }
    }

    isFormFulfilled() {
        let allInputsMatchPattern = true, {inputs} = this.state;
        Object.getOwnPropertyNames(inputs).forEach(propName => {
            if (!inputs[propName].matchesPattern()) {
                allInputsMatchPattern = false;
            }
        });
        return allInputsMatchPattern;
    }

    render() {
        const {loading, inputs} = this.state;
        return (
            <Form onSubmit={this.handleLogin}>
                <Input label="Login"
                       placeholder="Type here..."
                       disabled={loading}
                       iconRight="user" required
                       value={inputs.username.inputValue}
                       onChange={e => this.handleChangeInput(e, inputs.username)}
                       error={inputs.username.errorMessage}/>
                <Input label="Password"
                       placeholder="Type here..."
                       disabled={loading}
                       iconRight="activity" required
                       value={inputs.password.inputValue}
                       onChange={e => this.handleChangeInput(e, inputs.password)}
                       inputRef={el => this._password = el}
                       error={inputs.password.errorMessage}/>
                <div className="slds-clearfix">
                    <div className="slds-float_left" style={{display: "flex"}}>
                        <Button className={loading ? "slds-hide" : "slds-show"}
                                type="brand" onClick={this.handleLogin}>Login</Button>
                        <Button className={loading ? "slds-hide" : "slds-show"} type="destructive"
                                onClick={this.handleLoginViaGmail}>Login via Gmail</Button>
                        {loading && <div className="slds-is-relative slds-p-around_small slds-p-left_medium">
                            <Spinner type="brand" container={false}/>
                        </div>}
                    </div>
                    <div className="slds-float_right">
                        <Button className={loading ? "slds-hide" : "slds-show"}
                                onClick={this.props.onSwitchForm}>Register</Button>
                    </div>
                </div>
            </Form>
        );
    }
}

export default Login;