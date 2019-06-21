import React from "react";
import AppContext from "../../../../model/services/context/AppContext";

import {Utility} from "../../../../model/services/utility/UtilityService";

import "./styles.css";

const _isOnline = (user, indicatorsMap) => {
    if (!!user && indicatorsMap.has(user.id)) {
        return indicatorsMap.get(user.id).active;
    } else {
        return false;
    }
};

const Indicator = props => {
    const {user, children} = props;
    if (Utility.isObjectEmpty(user)) return <span/>;
    return (
        <AppContext.Consumer>
            {context => {
                let online = _isOnline(user, context.indicatorsMap);
                return (
                    !!children
                        ? <IndicatorPicture online={online} {...props}>{children}</IndicatorPicture>
                        : <IndicatorText online={online} {...props}/>
                );
            }}
        </AppContext.Consumer>
    );
};

const IndicatorText = props => {
    const {online, onlinePlaceholder = "Online", offlinePlaceholder = "Offline"} = props;
    return (
        <span className="slds-text-color_weak">{online ? onlinePlaceholder : offlinePlaceholder}</span>
    );
};

const IndicatorPicture = props => {
    const {online, children} = props;
    return (
        <div className="slds-is-relative indicator-container">
            {children}
            <span className={`${online && "indicator-status__online"}`}/>
        </div>
    );
};

export default Indicator;