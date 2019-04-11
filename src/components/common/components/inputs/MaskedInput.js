import React from "react";
import Input from "@salesforce/design-system-react/module/components/input";

import {Utility} from "../../../../model/services/utility/UtilityService";

class MaskedInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: ""
        };
    }

    handleChange = (event) => {
        const {pattern} = this.props, inputValue = event.target.value,
            errorMessage = Utility.matches(inputValue, pattern) ? "" : pattern.errorMessage;
        this.setState({error: errorMessage}, _ => {
            const {onChange} = this.props;
            if (typeof onChange === "function") onChange(inputValue);
        });
    };

    render() {
        const {error} = this.state;
        return (
            <Input placeholder="Type here..."
                   {...this.props}
                   errorText={error}
                   onChange={this.handleChange}
            />
        );
    }
}

export default MaskedInput;