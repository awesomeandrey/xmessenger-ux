import React from "react";
import ApplicationEvents from "../../../../../../../../../model/application-events";
import Spinner from "@salesforce/design-system-react/module/components/spinner";
import Input from "@salesforce/design-system-react/module/components/input";
import InputIcon from "@salesforce/design-system-react/module/components/icon/input-icon";
import MaskedInput from "../../../../../../../../common/components/inputs/MaskedInput";
import EmailInput from "../../../../../../../../common/components/inputs/EmailInput";

import {Settings} from "../../../../../../../../../model/services/core/UserService";
import {CustomEvents} from "../../../../../../../../../model/services/utility/EventsService";
import {InputPatterns, Utility} from "../../../../../../../../../model/services/utility/UtilityService";

class ProfileInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            name: "",
            email: ""
        };
    }

    _updateUserInfo = updatedUser => {
        this.setState({loading: true}, _ => {
            Settings.changeProfileInfo(updatedUser)
                .then(_ => CustomEvents.fire({eventName: ApplicationEvents.USER.RELOAD}))
                .then(_ => this.setState({loading: false}));
        });
    };

    handleChangeName = _ => {
        const {user} = this.props, {name} = this.state, pattern = InputPatterns.NAME;
        if (!!name && Utility.matches(name, pattern) && user["name"] !== name) {
            this._updateUserInfo({...user, name});
        }
    };

    handleChangeEmail = _ => {
        const {user} = this.props, {email} = this.state, pattern = InputPatterns.EMAIL;
        if (!!email && Utility.matches(email, pattern) && user["email"] !== email) {
            this._updateUserInfo({...user, email});
        }
    };

    render() {
        const {user} = this.props, {loading, name, email} = this.state;
        return (
            <div className="slds-form--stacked slds-p-horizontal--small">
                <MaskedInput label="Name" placeholder="Enter your name"
                             iconRight={<InputIcon name="user" category="utility"/>}
                             disabled={loading} required
                             value={name || user["name"]} pattern={InputPatterns.NAME}
                             onChange={name => this.setState({name})}
                             onBlur={this.handleChangeName}/>
                <Input label="Username" disabled
                       value={Utility.decorateUsername(user["username"])}
                       iconRight={<InputIcon name="fallback" category="utility"/>}/>
                <EmailInput label="Email address" disabled={loading}
                            value={email} placeholder={user["email"] || "Type here..."}
                            onChange={email => this.setState({email})}
                            onBlur={this.handleChangeEmail}/>
                {loading && <div className="slds-float_left slds-is-relative slds-p-vertical--large slds-p-left_large">
                    <Spinner variant="brand" size="small"/>
                </div>}
            </div>
        );
    }
}

export default ProfileInfo;