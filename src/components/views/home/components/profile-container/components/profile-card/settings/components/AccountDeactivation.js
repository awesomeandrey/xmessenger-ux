import React from "react";
import Events from "../../../../../../../../../model/events/application-events";

import {Button, Icon, Input, Spinner} from "react-lightning-design-system";
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
            this.setState({error: "Username is not confirmed"});
        } else {
            CustomEvents.fire({eventName: Events.SETTINGS.LOCK, detail: {locked: true}})
                .then(_ => this.setState({loading: true, error: ""}))
                .then(_ => Settings.changeProfileInfo({id: user.id, active: false}))
                .then(LoginService.logout)
                .then(_ => Navigation.toLogin({}));
        }
    };

    render() {
        const {loading, username, error} = this.state;
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
                        {loading && <div className="slds-is-relative slds-p-around_medium">
                            <Spinner type="brand" container={false}/>
                        </div>}
                        {!loading && <Input iconRight="fallback" required
                                            placeholder="Confirm your login"
                                            value={username} error={error}
                                            onChange={event => this.setState({username: event.target.value})}/>}
                    </div>
                    <div className="slds-float--right">
                        <Button className={`${loading && "slds-hide"}`} type="destructive"
                                onClick={this.handleDeleteAccount}>Delete account</Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default AccountDeactivation;