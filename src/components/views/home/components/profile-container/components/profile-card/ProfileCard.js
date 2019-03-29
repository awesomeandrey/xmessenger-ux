import React from 'react';
import Events from "../../../../model/HomePageEvents";
import ScalableImage from "../../../../../../common/components/images/scalable/ScalableImage";
import Settings from "./settings/Settings";

import {UserService} from "../../../../../../../model/services/core/UserService";
import {Button, DropdownButton, DropdownMenuItem, Spinner} from "react-lightning-design-system";
import {LoginService} from "../../../../../../../model/services/core/AuthenticationService";
import {Utility} from "../../../../../../../model/services/utility/UtilityService";
import {Navigation} from "../../../../../../../model/services/utility/NavigationService";
import {CustomEvents} from "../../../../../../../model/services/utility/EventsService";
import {SessionStorage} from "../../../../../../../model/services/utility/StorageService";

class ProfileCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {}
        };
    }

    componentDidMount() {
        UserService.getCurrentUser()
            .then(user => this.setState({user: user}));

        CustomEvents.register({
            eventName: Events.USER.RELOAD,
            callback: _ => {
                UserService.getCurrentUser(true)
                    .then(user => this.setState({user: user}));
            }
        });
    }

    handleLogout() {
        LoginService.logout()
            .then(SessionStorage.clear)
            .then(_ => Navigation.toLogin({}));
    }

    handleOpenSettings() {
        CustomEvents.fire({eventName: Events.SETTINGS.OPEN});
    }

    render() {
        const {user} = this.state;
        return (
            <Settings user={user}>
                <div className="slds-media slds-media_center slds-has-flexi-truncate">
                    <div className="slds-media__figure slds-avatar slds-avatar_large">
                        <ScalableImage title={user.name} src={UserService.composeUserPictureUrl(user, true)}/>
                    </div>
                    <div className="slds-media__body">
                        <p className="slds-float_left">
                            <span className="title-caps">{user.name}</span><br/>
                            <span>{Utility.decorateUsername(user.username)}</span>
                        </p>
                        <div className="slds-float_right">
                            <Button type="neutral" className="mobile-visible-only"
                                    onClick={this.handleLogout}>Logout</Button>
                            <DropdownButton type="icon-more" icon="setup" className="mobile-hidden">
                                <DropdownMenuItem iconRight="settings"
                                                  onClick={this.handleOpenSettings}>Settings</DropdownMenuItem>
                                <DropdownMenuItem iconRight="power"
                                                  onClick={this.handleLogout}>Logout </DropdownMenuItem>
                            </DropdownButton>
                        </div>
                    </div>
                </div>
            </Settings>
        );
    }
}

export default ProfileCard;