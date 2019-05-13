import React from "react";
import AppContext from "../../../../../../model/services/context/AppContext";

import "./styles.css";

const _isOnline = (user, indicatorsMap) => {
    if (!!user && indicatorsMap.has(user.id)) {
        return indicatorsMap.get(user.id).loggedIn;
    } else {
        return false;
    }
};

const Indicator = props => {
    const {user, children} = props;
    return (
        <AppContext.Consumer>
            {context => (
                <div className={`slds-is-relative ${context.richOnlineExperienceMode && "indicator"}`}>
                    {children}
                    <span className={`${_isOnline(user, context.indicatorsMap) && "online"}`}/>
                </div>
            )}
        </AppContext.Consumer>
    );
};

export default Indicator;