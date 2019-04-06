import React from "react";

import {Input} from "react-lightning-design-system";
import {InputPatterns, Utility} from "../../../../model/services/utility/UtilityService";

class PasswordInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            error: ""
        };
    }

    componentDidMount() {
        if (this._input !== undefined) this._input.type = "password";
    }

    handleChange = (event) => {
        const inputValue = event.target.value,
            error = Utility.matches(inputValue, InputPatterns.PASSWORD) ? "" : InputPatterns.PASSWORD.errorMessage;
        this.setState({value: inputValue, error}, _ => {
            const {onChange} = this.props;
            if (typeof onChange === "function") {
                onChange(inputValue);
            }
        })
    };

    render() {
        const {value, error} = this.state;
        return (
            <Input label="Password"
                   iconRight="fallback"
                   placeholder="Type here..."
                   inputRef={el => this._input = el}
                   value={value}
                   error={error}
                   required
                   {...this.props}
                   onChange={this.handleChange}/>
        );
    }
}

export default PasswordInput;