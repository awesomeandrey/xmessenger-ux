import React from "react";
import Events from "../../../../../model/HomePageEvents";

import {Settings} from "../../../../../../../../model/services/core/UserService";
import {InputPatterns} from "../../../../../../../../model/services/utility/UtilityService";
import {CustomEvents} from "../../../../../../../../model/services/utility/EventsService";
import {Button, ButtonGroup, Form, Input, Spinner} from "react-lightning-design-system";
import InputField from "../../../../../../../common/wrappers/InputField";

class PasswordSettings extends React.Component {
    constructor(props) {
        super(props);
        this.handleClearForm = this.handleClearForm.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.isFormFulfilled = this.isFormFulfilled.bind(this);
        this.state = {
            loading: false,
            notification: Object.create(null),
            inputs: {
                p1: Object.create(null), // current password;
                p2: Object.create(null), // new password;
                p3: Object.create(null) // confirmed password;
            }
        };
    }

    componentDidMount() {
        // Setup password type on input elements;
        [this._p1, this._p2, this._p3].forEach(el => {
            if (el !== undefined) {
                el.type = "password"
            }
        });
        // Clear form data;
        this.handleClearForm();
    }

    handleClearForm() {
        // Instantiate field entities;
        const inputFields = Object.create(null);
        [
            new InputField("", {fieldName: "p1", pattern: InputPatterns.PASSWORD}),
            new InputField("", {fieldName: "p2", pattern: InputPatterns.PASSWORD}),
            new InputField("", {fieldName: "p3", pattern: InputPatterns.PASSWORD})
        ].forEach(inputField => {
            Object.defineProperty(inputFields, inputField.fieldName, {
                value: inputField, writable: true
            });
        });
        this.setState({notification: null, inputs: inputFields});
    }

    handleChangePassword() {
        this.setState({loading: true});
        if (this.isFormFulfilled()) {
            const {inputs} = this.state;
            CustomEvents.fire({eventName: Events.SETTINGS.LOCK, detail: {locked: true}})
                .then(this.handleClearForm)
                .then(_ => Settings.changePassword({
                    password: inputs.p1.inputValue,
                    newPassword: inputs.p2.inputValue
                }))
                .then(_ => ({type: "success", message: "Changed password!"}),
                    error => ({type: "error", message: error.message}))
                .then(notification => this.setState({
                    notification: notification, loading: false
                }))
                .then(CustomEvents.fire({eventName: Events.SETTINGS.LOCK, detail: {locked: false}}));
        } else {
            this.setState({
                loading: false,
                notification: {type: "error", message: "All fields should be populated correctly."}
            });
        }
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
            let inputField = inputs[propName];
            if (!inputField.matchesPattern()) {
                allInputsMatchPattern = false;
            }
        });
        if (inputs.p2.inputValue !== inputs.p3.inputValue) {
            allInputsMatchPattern = false;
        }
        return allInputsMatchPattern;
    }

    render() {
        const {user} = this.props, {loading, notification, inputs} = this.state;
        if (user.loggedExternally) {
            return (
                <div className="slds-align--absolute-center">
                    <h1 className="slds-p-around_large">No password change</h1>
                </div>
            );
        } else {
            return (
                <div className="slds-form">
                    <Form onSubmit={e => e.preventDefault()}>
                        <Input label="Current password"
                               iconRight="fallback"
                               placeholder="Type here..."
                               inputRef={el => this._p1 = el}
                               disabled={loading}
                               value={inputs.p1.inputValue}
                               error={inputs.p1.errorMessage}
                               onChange={e => this.handleChangeInput(e, inputs.p1)}
                               required/>
                        <Input label="New password"
                               iconRight="fallback"
                               placeholder="Type here..."
                               inputRef={el => this._p2 = el}
                               disabled={loading}
                               value={inputs.p2.inputValue}
                               error={inputs.p2.errorMessage}
                               onChange={e => this.handleChangeInput(e, inputs.p2)}
                               required/>
                        <Input label="Repeat password"
                               iconRight="fallback"
                               placeholder="Type here..."
                               inputRef={el => this._p3 = el}
                               disabled={loading}
                               value={inputs.p3.inputValue}
                               error={inputs.p3.errorMessage}
                               onChange={e => this.handleChangeInput(e, inputs.p3)}
                               required/>
                        <div className="slds-clearfix slds-m-top_small">
                            <div className="slds-float--left">
                                {loading
                                    ? (<div className="slds-is-relative slds-p-around_medium">
                                        <Spinner type="brand" container={false}/></div>)
                                    : (!!notification && <div className={`slds-text-color_${notification.type}`}>
                                        {notification.message}</div>)}
                            </div>
                            <div className="slds-float--right">
                                <ButtonGroup className={loading ? "slds-hide" : "slds-show"}>
                                    <Button type="neutral" onClick={this.handleClearForm}>Reset</Button>
                                    <Button type="brand" onClick={this.handleChangePassword}>Change Password</Button>
                                </ButtonGroup>
                            </div>
                        </div>
                    </Form>
                </div>
            );
        }
    }
}

export default PasswordSettings;