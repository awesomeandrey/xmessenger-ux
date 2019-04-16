import React from "react";
import UserPicture from "../../../../../common/components/images/user-picture/UserPicture";
import PropsLoader from "../../../../../common/components/loader/PropsLoader";
import Button from "@salesforce/design-system-react/module/components/button";
import MediaObject from "@salesforce/design-system-react/module/components/media-object";

const HeaderPanel = props => {
    const {chat} = props, {fellow} = chat;
    return (
        <MediaObject figure={<div className="slds-avatar slds-avatar_large"><UserPicture user={fellow}/></div>}
                     body={
                         <div className="slds-clearfix">
                             <h2 className="slds-float--left"><span className="slds-card__header slds-truncate">
                                    <span className="slds-text-heading_small">{fellow.name}</span>
                                </span></h2>
                             <div className="slds-float--right">
                                 <Button variant="neutral" onClick={_ => {
                                     document.body.scrollTop = 0; // For Safari
                                     document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
                                 }} className="mobile-visible-only">Back</Button>
                             </div>
                         </div>
                     }/>
    );
};

export default PropsLoader("chat")(HeaderPanel);