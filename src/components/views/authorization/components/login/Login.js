import React from 'react';
import FieldDefinition from "../../../../common/model/FieldDefinition";

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

        // Instantiate fieldDef entities;
        let inputs = Object.create(null);
        [
            new FieldDefinition("", {name: "username", pattern: InputPatterns.LOGIN}),
            new FieldDefinition("", {name: "password", pattern: InputPatterns.PASSWORD})
        ].forEach(fieldDef => {
            Object.defineProperty(inputs, fieldDef.name, {
                value: fieldDef, writable: true
            });
        });
        this.setState({inputs: inputs});
    }

    handleLogin() {
        this.setState({loading: true});
        const {inputs} = this.state;
        if (this.isFormFulfilled()) {
            LoginService.login({
                username: inputs.username.value,
                password: inputs.password.value
            }).then(_ => {
                Navigation.toHome({});
            }, errorMessage => {
                inputs.username.error = errorMessage;
                inputs.password.value = "";
                this.setState({loading: false, inputs: inputs});
            });
        } else {
            Object.getOwnPropertyNames(inputs).forEach(p => {
                if (!inputs[p].matchesPattern()) {
                    inputs[p].error = inputs[p].pattern.errorMessage;
                }
            });
            this.setState({loading: false, inputs: inputs});
        }
    }

    handleLoginViaGmail() {
        // Initiate OAuth flow;
        this.setState({loading: true});
        OAuthService.requestTokenUrl()
            .then(url => Navigation.toCustom({url: url, replace: true}))
            .catch(e => {
                this.setState({loading: false});
                console.error(JSON.stringify(e));
            });
    }

    handleChangeInput(event, fieldDef) {
        const {inputs} = this.state, inputName = fieldDef.name;
        if (!!inputs[inputName]) {
            fieldDef.value = event.target.value;
            Object.defineProperty(inputs, inputName, {
                value: fieldDef
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
                       value={inputs.username.value}
                       onChange={e => this.handleChangeInput(e, inputs.username)}
                       error={inputs.username.error}/>
                <Input label="Password"
                       placeholder="Type here..."
                       disabled={loading}
                       iconRight="activity" required
                       value={inputs.password.value}
                       onChange={e => this.handleChangeInput(e, inputs.password)}
                       inputRef={el => this._password = el}
                       error={inputs.password.error}/>
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