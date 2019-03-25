import React from 'react';
import Events from "../../../../model/HomePageEvents";
import ScalableImage from "../../../../../../common/components/images/scalable/ScalableImage";

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
        this.handleOpenSettings = this.handleOpenSettings.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.state = {
            user: null
        };
    }

    componentWillMount() {
        CustomEvents.register({
            eventName: Events.USER.RELOAD,
            callback: _ => {
                this.setState({user: null});
                UserService.getCurrentUser(true)
                    .then(user => this.setState({user: user}));
            }
        });
    }

    componentDidMount() {
        CustomEvents.fire({eventName: Events.USER.RELOAD});
    }

    handleLogout() {
        LoginService.logout()
            .then(SessionStorage.clear)
            .then(_ => Navigation.toLogin({}));
    }

    handleOpenSettings() {
        const {user} = this.state;
        CustomEvents.fire({
            eventName: Events.SETTINGS.OPEN,
            detail: user
        });
    }

    render() {
        const {user} = this.state;
        if (!user) {
            return (
                <div className="slds-align--absolute-center">
                    <Spinner type="brand" size="small" container={false}/>
                </div>
            );
        } else {
            return (
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
                            {
                                Utility.isMobileDevice()
                                    ? <Button type="neutral" onClick={this.handleLogout}>Logout</Button>
                                    : <DropdownButton type="icon-more" icon="setup">
                                        <DropdownMenuItem iconRight="settings"
                                                          onClick={this.handleOpenSettings}>Settings</DropdownMenuItem>
                                        <DropdownMenuItem iconRight="power"
                                                          onClick={this.handleLogout}>Logout </DropdownMenuItem>
                                    </DropdownButton>
                            }
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default ProfileCard;