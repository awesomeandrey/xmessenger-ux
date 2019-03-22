import React from 'react';
import {Icon} from "react-lightning-design-system";
import {Utility} from "../../../../model/services/utility/UtilityService";

const EmptyArea = ({title, icon = "utility:error", className = ""}) => {
    return (
        <div className={Utility.join("slds-align_absolute-center", "slds-text-align_center", className)}>
            <p className="slds-text-body_small">
                <Icon icon={icon} size="small"/>
                <span className="slds-m-left--small">{title}</span>
            </p>
        </div>
    );
};

export default EmptyArea;