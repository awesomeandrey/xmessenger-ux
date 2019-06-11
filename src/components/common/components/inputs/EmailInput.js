import React from "react";
import MaskedInput from "./MaskedInput";
import InputIcon from "@salesforce/design-system-react/module/components/icon/input-icon";

import {InputPatterns} from "../../../../model/services/utility/UtilityService";

export default props => {
    return (
        <MaskedInput label="Password"
                     placeholder="default@example.com"
                     type="email"
                     pattern={InputPatterns.EMAIL}
                     iconRight={<InputIcon name="email" category="action"/>}
                     {...props}
        />
    );
}