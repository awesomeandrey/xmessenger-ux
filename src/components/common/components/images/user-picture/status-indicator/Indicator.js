import React from "react";

import {Utility} from "../../../../../../model/services/utility/UtilityService";

import "./styles.css";

const _isOnline = (user, indicatorsMap) => {
    if (!!user && indicatorsMap.has(user.id)) {
        return indicatorsMap.get(user.id).loggedIn;
    } else {
        return false;
    }
};

const Indicator = props => {
    const {user, indicatorsMap, richOnlineExperienceMode, children} = props;
    if (Utility.isObjectEmpty(user)) return <span/>;
    return (
        <div className={`slds-is-relative ${richOnlineExperienceMode && "indicator"}`}>
            {children}
            <span className={`${richOnlineExperienceMode && _isOnline(user, indicatorsMap) && "online"}`}/>
        </div>
    );
};

export default Indicator;