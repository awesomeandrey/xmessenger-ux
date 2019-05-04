import React from "react";
import Events from "../../../../../../../../../model/events/application-events";
import MediaObject from "@salesforce/design-system-react/module/components/media-object";
import Icon from "@salesforce/design-system-react/module/components/icon";
import Spinner from "@salesforce/design-system-react/module/components/spinner";
import Button from "@salesforce/design-system-react/module/components/button";
import InputIcon from "@salesforce/design-system-react/module/components/icon/input-icon";
import Input from "@salesforce/design-system-react/module/components/input";

import {Navigation} from "../../../../../../../../../model/services/utility/NavigationService";
import {LoginService} from "../../../../../../../../../model/services/core/AuthenticationService";
import {Settings} from "../../../../../../../../../model/services/core/UserService";
import {CustomEvents} from "../../../../../../../../../model/services/utility/EventsService";

class AccountDeactivation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            username: "",
            error: ""
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.reset && this.props.reset) {
            this.setState({loading: false, username: "", error: ""});
        }
    }

    handleDeleteAccount = _ => {
        const {user} = this.props, {username} = this.state;
        if (user.username !== username) {
            this.setState({username: "", error: "Username is not confirmed"});
        } else {
            this.setState({loading: true, error: ""}, _ => {
                CustomEvents.fire({eventName: Events.SETTINGS.LOCK, detail: {locked: true}})
                    .then(_ => Settings.changeProfileInfo({id: user.id, active: false}))
                    .then(LoginService.logoutUser);
            });
        }
    };

    render() {
        const {loading, username, error} = this.state;
        return (
            <div className="slds-grid slds-wrap slds-gutters">
                <div className="slds-col slds-size_1-of-1">
                    <MediaObject className="slds-scoped-notification" verticalCenter
                                 figure={<Icon category="utility" name="info" size="medium"/>}
                                 body={<p>If you're going to delete your account in xMessenger, keep in mind
                                     that your data will not be purged. It'll reside in system and only SA will take
                                     final decision whether it should be cleared or not.</p>}/>
                </div>
                <div className="slds-col slds-size_1-of-1 slds-m-top_small">
                    <div className="slds-float--left">
                        {loading && <div className="slds-is-relative slds-p-around_medium">
                            <Spinner variant="brand" size="small"/>
                        </div>}
                        {!loading && <Input
                            iconRight={<InputIcon name="fallback" category="utility"/>}
                            placeholder="Confirm your login" required
                            value={username} errorText={error}
                            onChange={event => this.setState({username: event.target.value})}/>}
                    </div>
                    <div className="slds-float--right">
                        <Button className={`${loading && "slds-hide"}`} variant="destructive"
                                onClick={this.handleDeleteAccount}>Delete account</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default AccountDeactivation;