import React from "react";
import Icon from "@salesforce/design-system-react/module/components/icon";

import {Utility} from "../../../../model/services/utility/UtilityService";

const EmptyArea = ({title, icon = "error", className = "slds-p-vertical_medium"}) => {
    return (
        <div className={Utility.join("slds-align_absolute-center", "slds-text-align_center", className)}>
            <p className="slds-text-body_small">
                <Icon category="utility" name={icon} size="small"/>
                <span className="slds-m-left--small">{title}</span>
            </p>
        </div>
    );
};

export default EmptyArea;