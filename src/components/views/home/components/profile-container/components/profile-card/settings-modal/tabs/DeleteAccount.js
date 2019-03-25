import React from "react";
import FieldDefinition from "../../../../../../../../common/model/FieldDefinition";
import Events from "../../../../../../model/HomePageEvents";

import {Button, Icon, Input, Spinner} from "react-lightning-design-system";
import {InputPatterns} from "../../../../../../../../../model/services/utility/UtilityService";
import {Navigation} from "../../../../../../../../../model/services/utility/NavigationService";
import {LoginService} from "../../../../../../../../../model/services/core/AuthenticationService";
import {Settings} from "../../../../../../../../../model/services/core/UserService";
import {CustomEvents} from "../../../../../../../../../model/services/utility/EventsService";

class DeleteAccount extends React.Component {
    constructor(props) {
        super(props);
        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.handleDeleteAccount = this.handleDeleteAccount.bind(this);
        this.state = {
            loading: false,
            usernameInput: new FieldDefinition("", {fieldName: "username", pattern: InputPatterns.LOGIN})
        };
    }

    handleDeleteAccount() {
        const {user} = this.props, {usernameInput} = this.state;
        if (user.username !== usernameInput.inputValue) {
            usernameInput.errorMessage = "Username is not confirmed";
            this.setState({usernameInput: usernameInput});
        } else {
            CustomEvents.fire({eventName: Events.SETTINGS.LOCK, detail: {locked: true}})
                .then(_ => this.setState({loading: true}))
                .then(_ => Settings.changeProfileInfo({
                    id: user.id,
                    active: false
                }))
                .then(LoginService.logout)
                .then(_ => Navigation.toLogin({}));
        }
    }

    handleChangeInput(e) {
        const {usernameInput} = this.state;
        usernameInput.inputValue = e.target.value;
        this.setState({usernameInput: usernameInput});
    }

    render() {
        const {loading, usernameInput} = this.state;
        return (
            <div className="slds-grid slds-wrap slds-gutters">
                <div className="slds-col slds-size_1-of-1">
                    <div className="slds-scoped-notification slds-media slds-media_center" role="status">
                        <div className="slds-media__figure">
                            <Icon category="utility" size="medium" icon="info"/>
                        </div>
                        <div className="slds-media__body">
                            <p>If you're going to delete your account in xMessenger, keep in mind
                                that your data will not be purged. It'll reside in system and only SA will take
                                final decision whether it should be cleared or not.</p>
                        </div>
                    </div>
                </div>
                <div className="slds-col slds-size_1-of-1 slds-m-top_small">
                    <div className="slds-float--left">
                        {loading
                            ? (<div className="slds-is-relative slds-p-around_medium">
                                <Spinner type="brand" container={false}/>
                            </div>)
                            : (<Input iconRight="fallback" placeholder="Confirm your login"
                                      value={usernameInput.inputValue} error={usernameInput.errorMessage}
                                      onChange={this.handleChangeInput} required/>)}
                    </div>
                    <div className="slds-float--right">
                        <Button className={loading ? "slds-hide" : "slds-show"} type="destructive"
                                onClick={this.handleDeleteAccount}>Delete account</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default DeleteAccount;