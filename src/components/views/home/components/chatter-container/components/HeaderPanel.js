import React from "react";
import UserPicture from "../../../../../common/components/images/user-picture/UserPicture";
import PropsLoader from "../../../../../common/components/loader/PropsLoader";
import Button from "@salesforce/design-system-react/module/components/button";
import MediaObject from "@salesforce/design-system-react/module/components/media-object";
import Indicator from "../../../../../common/components/indicator/Indicator";
import ApplicationEvents from "../../../../../../model/application-events";

import {Utility} from "../../../../../../model/services/utility/UtilityService";
import {CustomEvents} from "../../../../../../model/services/utility/EventsService";

const HeaderPanel = props => {
    const {chat} = props, {fellow} = chat,
        lastLoginDate = Utility.formatDate({dateNum: fellow["lastLogin"], showTimestamp: false});
    return (
        <MediaObject figure={<UserPicture user={fellow}/>}
                     body={
                         <div className="flex-container flex-container__space-between">
                             <p className="slds-float--left">
                                 <span className="slds-text-title_caps theme-inherit">{fellow["name"]}</span><br/>
                                 <Indicator className="slds-text-color_weak theme-inherit" user={fellow}
                                            offlinePlaceholder={`Last login: ${lastLoginDate}`}/>
                             </p>
                             <div className="slds-float--right">
                                 <Button variant="neutral" onClick={_ => {
                                     CustomEvents.fire({
                                         eventName: ApplicationEvents.CHAT.SELECT, detail: {selectedChat: null}
                                     }).then(() => Utility.scrollToTop());
                                 }} className="mobile-visible-only">Back</Button>
                             </div>
                         </div>
                     }/>
    );
};

export default PropsLoader("chat")(HeaderPanel);