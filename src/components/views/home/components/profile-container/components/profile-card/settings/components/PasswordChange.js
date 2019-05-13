import React from "react";
import Events from "../../../../../../../../../model/application-events";
import PasswordInput from "../../../../../../../../common/components/inputs/PasswordInput";
import MediaObject from "@salesforce/design-system-react/module/components/media-object";
import Spinner from "@salesforce/design-system-react/module/components/spinner";
import ButtonGroup from "@salesforce/design-system-react/module/components/button-group";
import Button from "@salesforce/design-system-react/module/components/button";
import Icon from "@salesforce/design-system-react/module/components/icon";

import {Settings} from "../../../../../../../../../model/services/core/UserService";
import {InputPatterns, Utility} from "../../../../../../../../../model/services/utility/UtilityService";
import {CustomEvents} from "../../../../../../../../../model/services/utility/EventsService";

class PasswordChange extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            notification: null,
            inputs: {
                p1: "", // current password;
                p2: "", // new password;
                p3: ""  // confirmed new password;
            }
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.reset && this.props.reset) {
            this.handleClearForm();
        }
    }

    handleClearForm = notification => {
        this.setState({
            loading: false,
            notification: notification,
            inputs: {
                p1: "",
                p2: "",
                p3: ""
            }
        });
    };

    handleChangePassword = () => {
        if (this.isFormFulfilled()) {
            this.setState({loading: true}, _ => {
                const {inputs} = this.state;
                CustomEvents.fire({eventName: Events.SETTINGS.LOCK, detail: {locked: true}})
                    .then(this.handleClearForm)
                    .then(_ => Settings.changePassword({password: inputs.p1, newPassword: inputs.p2}))
                    .then(_ => ({type: "success", message: "Changed password!"}),
                        error => ({type: "error", message: error.message}))
                    .then(notification => this.setState({notification: notification, loading: false}))
                    .then(CustomEvents.fire({eventName: Events.SETTINGS.LOCK, detail: {locked: false}}));
            });
        } else {
            this.handleClearForm({type: "error", message: "All fields should be populated correctly."});
        }
    };

    isFormFulfilled = _ => {
        const {inputs} = this.state;
        for (let key in inputs) {
            if (inputs.hasOwnProperty(key) && !Utility.matches(inputs[key], InputPatterns.PASSWORD)) return false;
        }
        return inputs.p2 === inputs.p3;
    };

    render() {
        const {loading, notification, inputs} = this.state, {reset} = this.props;
        if (reset) return <span/>;
        return (
            <MediaObject figure={<Icon category="action" name="password_unlock" size="large"/>}
                         body={
                             <form className="slds-form_stacked" onSubmit={e => e.preventDefault()}>
                                 <PasswordInput className="slds-m-bottom--small"
                                                label="Current password"
                                                disabled={loading}
                                                value={inputs.p1}
                                                onChange={val => {
                                                    inputs.p1 = val;
                                                    this.setState({inputs});
                                                }}/>
                                 <PasswordInput className="slds-m-bottom--small"
                                                label="New password"
                                                disabled={loading}
                                                value={inputs.p2}
                                                onChange={val => {
                                                    inputs.p2 = val;
                                                    this.setState({inputs});
                                                }}/>
                                 <PasswordInput label="Repeat password"
                                                disabled={loading}
                                                value={inputs.p3}
                                                onChange={val => {
                                                    inputs.p3 = val;
                                                    this.setState({inputs});
                                                }}/>
                                 <div className="slds-clearfix slds-m-top_small">
                                     <div className="slds-float--left">
                                         {loading
                                             ? (<div className="slds-is-relative slds-p-around_medium">
                                                 <Spinner variant="brand" size="small"/></div>)
                                             : (!!notification &&
                                                 <div className={`slds-text-color_${notification.type}`}>
                                                     {notification.message}</div>)}
                                     </div>
                                     <div className="slds-float--right">
                                         <ButtonGroup className={loading ? "slds-hide" : "slds-show"}>
                                             <Button variant="neutral" onClick={this.handleClearForm}>Reset</Button>
                                             <Button variant="brand" onClick={this.handleChangePassword}>
                                                 Change Password</Button>
                                         </ButtonGroup>
                                     </div>
                                 </div>
                             </form>
                         }/>
        );
    }
}

export default PasswordChange;