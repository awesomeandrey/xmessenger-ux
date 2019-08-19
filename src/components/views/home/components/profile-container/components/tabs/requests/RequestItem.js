import React from "react";
import MediaObject from "@salesforce/design-system-react/module/components/media-object";
import UserPicture from "../../../../../../../common/components/images/user-picture/UserPicture";
import ButtonGroup from "@salesforce/design-system-react/module/components/button-group";
import Button from "@salesforce/design-system-react/module/components/button";

import {Utility} from "../../../../../../../../model/services/utility/UtilityService";

export default props => {
    const {request, onProcess} = props, {sender} = request;
    return (
        <MediaObject className="slds-box slds-box_x-small"
                     figure={<UserPicture user={sender}/>}
                     body={
                         <div className="slds-clearfix">
                             <p className="slds-float_left">
                                 <span className="slds-text-body_regular">{sender["name"]}</span><br/>
                                 <span className="slds-text-color_weak theme-inherit">
                                     <span>{Utility.decorateUsername(sender["username"])}</span>
                                     <span>{Utility.appendDateStamp(request["createdDate"])}</span>
                                 </span>
                             </p>
                             <ButtonGroup className="slds-float_right">
                                 <Button iconCategory="utility"
                                         iconName="like"
                                         onClick={() => onProcess(request, true)}
                                         iconVariant="border-filled"
                                 />
                                 <Button iconCategory="utility"
                                         iconName="dislike"
                                         onClick={() => onProcess(request, false)}
                                         iconVariant="border-filled"
                                 />
                             </ButtonGroup>
                         </div>
                     }/>
    );
};