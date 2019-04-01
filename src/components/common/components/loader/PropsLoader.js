import React, {Component} from "react";

import {Spinner} from "react-lightning-design-system";

const PropsLoader = propToCheck => WrappedComponent => {
    return class LoadingHOC extends Component {
        render() {
            const ready = !!propToCheck
                ? this.props.hasOwnProperty(propToCheck) && !!this.props[propToCheck]
                : true;
            return (
                <div className={`stateful-container slds-is-relative ${!ready && "slds-m-around_large"}`}>
                    {ready ? <WrappedComponent {...this.props}/> : <Spinner/>}
                </div>
            );
        }
    };
};

export default PropsLoader;