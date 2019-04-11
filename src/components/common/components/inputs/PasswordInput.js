import React from "react";
import MaskedInput from "./MaskedInput";
import InputIcon from "@salesforce/design-system-react/module/components/icon/input-icon";

import {InputPatterns} from "../../../../model/services/utility/UtilityService";

export default props => {
    return (
        <MaskedInput label="Password"
                     required
                     type="password"
                     pattern={InputPatterns.PASSWORD}
                     iconRight={<InputIcon name="fallback" category="utility"/>}
                     {...props}
        />
    );
}