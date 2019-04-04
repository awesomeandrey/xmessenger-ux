import React from 'react';
import Events from "../../../../../../../model/events/application-events";
import SettingsModal from "./settings/SettingsModal";
import ScalableImage from "../../../../../../common/components/images/scalable/ScalableImage";
import PropsLoader from "../../../../../../common/components/loader/PropsLoader";

import {Button, DropdownButton, DropdownMenuItem} from "react-lightning-design-system";
import {LoginService} from "../../../../../../../model/services/core/AuthenticationService";
import {Utility} from "../../../../../../../model/services/utility/UtilityService";
import {Navigation} from "../../../../../../../model/services/utility/NavigationService";
import {CustomEvents} from "../../../../../../../model/services/utility/EventsService";
import {SessionStorage} from "../../../../../../../model/services/utility/StorageService";
import {UserService} from "../../../../../../../model/services/core/UserService";

class ProfileCard extends React.Component {
    constructor(props) {
        super(props);
    }

    handleLogout = _ => {
        LoginService.logout()
            .then(SessionStorage.clear)
            .then(_ => Navigation.toLogin({}));
    };

    handleOpenSettings = _ => {
        CustomEvents.fire({eventName: Events.SETTINGS.OPEN});
    };

    render() {
        const {user} = this.props;
        return (
            <div className="slds-media slds-media_center slds-has-flexi-truncate">
                <SettingsModal user={user}/>
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
        );
    }
}

export default PropsLoader("user")(ProfileCard);