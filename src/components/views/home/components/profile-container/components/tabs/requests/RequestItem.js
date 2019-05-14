import React from "react";
import MediaObject from "@salesforce/design-system-react/module/components/media-object";
import UserPicture from "../../../../../../../common/components/images/user-picture/UserPicture";
import ButtonGroup from "@salesforce/design-system-react/module/components/button-group";
import Button from "@salesforce/design-system-react/module/components/button";

import {Utility} from "../../../../../../../../model/services/utility/UtilityService";

export default props => {
    const {request, onProcess} = props, {sender} = request, {name, username} = sender;
    return (
        <MediaObject className="slds-box slds-box_x-small"
                     figure={<UserPicture user={sender}/>}
                     body={
                         <div className="slds-clearfix">
                             <p className="slds-float_left">
                                 <span className="slds-text-body_regular">{name}</span><br/>
                                 <span className="slds-text-body_small slds-text-color_weak">
                                 {Utility.decorateUsername(username)}</span>
                             </p>
                             <ButtonGroup className="slds-float_right">
                                 <Button variant="brand"
                                         onClick={_ => onProcess(request, true)}>Accept</Button>
                                 <Button variant="destructive"
                                         onClick={_ => onProcess(request, false)}>Reject</Button>
                             </ButtonGroup>
                         </div>
                     }/>
    );
};