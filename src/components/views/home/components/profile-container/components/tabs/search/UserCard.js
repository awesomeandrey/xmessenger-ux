import React from "react";
import UserPicture from "../../../../../../../common/components/images/user-picture/UserPicture";
import Icon from "@salesforce/design-system-react/module/components/icon";
import Button from "@salesforce/design-system-react/module/components/button";

import {Utility} from "../../../../../../../../model/services/utility/UtilityService";

export default props => {
    const {user, onSendRequest, alreadySent} = props;
    return (
        <figure className="slds-image slds-image--card slds-m-top_medium">
            <div className="slds-image__crop slds-image__crop--16-by-9 stretch">
                <UserPicture user={user} hasIndicator={false}/>
            </div>
            <figcaption className="slds-image__title slds-image__title--card">
                <div className="slds-clearfix width-stretch">
                    <h3 className="slds-float_left">
                        {user.name}<br/>
                        <small>{Utility.decorateUsername(user.username)}</small>
                    </h3>
                    <div className="slds-float_right">
                        {alreadySent && <Icon category="utility" name="check" size="medium"/>}
                        {!alreadySent && <Button variant="neutral" onClick={onSendRequest}>Send Request</Button>}
                    </div>
                </div>
            </figcaption>
        </figure>
    );
};