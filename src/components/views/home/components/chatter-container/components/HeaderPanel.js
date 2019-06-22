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
                             <h2 className="slds-float--left">
                                 <span className="slds-text-heading_small">{fellow.name}</span>
                                 <div className="slds-text-color_weak theme-inherit">
                                     <Indicator user={fellow} offlinePlaceholder={`Last login: ${lastLoginDate}`}/>
                                 </div>
                             </h2>
                             <div className="slds-float--right">
                                 <Button variant="neutral" onClick={_ => {
                                     document.body.scrollTop = 0; // For Safari;
                                     document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera;
                                     CustomEvents.fire({
                                         eventName: ApplicationEvents.CHAT.SELECT,
                                         detail: {selectedChat: null}
                                     });
                                 }} className="mobile-visible-only">Back</Button>
                             </div>
                         </div>
                     }/>
    );
};

export default PropsLoader("chat")(HeaderPanel);