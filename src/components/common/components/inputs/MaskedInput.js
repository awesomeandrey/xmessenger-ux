import React from "react";

import {Input} from "react-lightning-design-system";
import {Utility} from "../../../../model/services/utility/UtilityService";

class MaskedInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            error: ""
        };
    }

    handleChange = (event) => {
        const {pattern} = this.props, inputValue = event.target.value,
            errorMessage = Utility.matches(inputValue, pattern) ? "" : pattern.errorMessage;
        this.setState({value: inputValue, error: errorMessage}, _ => {
            const {onChange} = this.props;
            if (typeof onChange === "function") onChange(inputValue);
        });
    };

    render() {
        const {value, error} = this.state;
        return (
            <Input label="Input field"
                   iconRight="fallback"
                   placeholder="Type here..."
                   value={value}
                   error={error}
                   {...this.props}
                   onChange={this.handleChange}/>
        );
    }
}

export default MaskedInput;