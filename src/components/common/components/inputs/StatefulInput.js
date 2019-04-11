import React from "react";
import MaskedInput from "./MaskedInput";

import {Utility} from "../../../../model/services/utility/UtilityService";

class StatefulInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            error: "",
            loading: false
        };
    }

    handleChange = (inputValue) => {
        const {promiseFunc, pattern, onChange} = this.props;
        if (!Utility.matches(inputValue, pattern)) {
            this.setState({value: inputValue, error: pattern.errorMessage}, onChange);
        } else {
            this.setState({value: inputValue, error: "", loading: true});
            promiseFunc(inputValue)
                .then(response => {
                    const {valid, errorMessage} = response;
                    this.setState({loading: false, error: errorMessage}, _ => {
                        onChange(valid ? inputValue : "");
                    });
                });
        }
    };

    render() {
        const {value, error, loading} = this.state;
        return (
            <MaskedInput hasSpinner={loading}
                         disabled={loading}
                         {...this.props}
                         value={value}
                         errorText={error}
                         onChange={this.handleChange}
            />
        );
    }
}

export default StatefulInput;