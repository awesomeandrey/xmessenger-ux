import React, {Component} from "react";
import Spinner from "@salesforce/design-system-react/module/components/spinner";

import {Navigation} from "../../../model/services/utility/NavigationService";
import {tokenExists} from "../../../model/api/rest/secureApi";

const SessionValidator = ({isLoginEntry = false}) => WrappedComponent => {
    return class HOC extends Component {
        constructor(props) {
            super(props);
            this.state = {
                renderComponent: false
            };
        }

        componentDidMount() {
            const tokenPresent = tokenExists();
            if (isLoginEntry) {
                if (tokenPresent) {
                    Navigation.toHome({});
                } else {
                    this.setState({renderComponent: true});
                }
            } else {
                if (tokenPresent) {
                    this.setState({renderComponent: true});
                } else {
                    Navigation.toLogin({jwtExpired: true});
                }
            }
        }

        render() {
            const {renderComponent} = this.state;
            return renderComponent ? <WrappedComponent {...this.props}/> : <Spinner variant="base" size="small"/>;
        }
    };
};

export default SessionValidator;