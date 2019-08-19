import React from "react";
import Events from "../../../../../../../model/application-events";
import SettingsModal from "./settings/SettingsModal";
import ScalableImage from "../../../../../../common/components/images/scalable/ScalableImage";
import PropsLoader from "../../../../../../common/components/loader/PropsLoader";
import Dropdown from "@salesforce/design-system-react/module/components/menu-dropdown";
import Button from "@salesforce/design-system-react/module/components/button";
import MediaObject from "@salesforce/design-system-react/module/components/media-object";

import {LoginService} from "../../../../../../../model/services/core/AuthenticationService";
import {Utility} from "../../../../../../../model/services/utility/UtilityService";
import {CustomEvents} from "../../../../../../../model/services/utility/EventsService";
import {UserService} from "../../../../../../../model/services/core/UserService";

const _onSelectOption = ({value = 2}) => {
    switch (value) {
        case 1:
            CustomEvents.fire({eventName: Events.SETTINGS.OPEN, detail: {isOpen: true}});
            break;
        case 2:
            LoginService.logoutUser();
            break;
    }
};

const ProfileCard = props => {
    const {user} = props;
    return (
        <MediaObject
            figure={
                <div className="slds-avatar slds-avatar_large">
                    <ScalableImage title={user.name} src={UserService.composeUserPictureUrl(user, true)}/>
                </div>
            }
            body={
                <div className="flex-container flex-container__space-between">
                    <SettingsModal {...props}/>
                    <p className="slds-float_left">
                        <span className="slds-text-title_caps theme-inherit">{user["name"]}</span><br/>
                        <span
                            className="slds-text-color_weak theme-inherit">{Utility.decorateUsername(user["username"])}</span>
                    </p>
                    <div className="slds-float_right">
                        <Button variant="neutral" className="mobile-visible-only"
                                onClick={_onSelectOption}>Logout</Button>
                        <Dropdown buttonClassName="mobile-hidden"
                                  iconCategory="utility"
                                  iconName="settings"
                                  iconVariant="border-filled"
                                  onSelect={_onSelectOption}
                                  options={[
                                      {
                                          label: "Settings",
                                          value: 1,
                                          rightIcon: {
                                              category: "utility",
                                              name: "settings",
                                          }
                                      },
                                      {
                                          label: "Logout",
                                          value: 2,
                                          rightIcon: {
                                              category: "utility",
                                              name: "power",
                                          }
                                      },
                                  ]}/>
                    </div>
                </div>
            }/>
    );
};

export default PropsLoader("user")(ProfileCard);