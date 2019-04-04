import React, {Component} from "react";

import {Spinner} from "react-lightning-design-system";
import {Utility} from "../../../../model/services/utility/UtilityService";

const PropsLoader = propNameToCheck => WrappedComponent => {
    if (typeof propNameToCheck !== "string") throw "[PropsLoader] -> 'propToCheck' should be of string type.";
    return class LoadingHOC extends Component {
        render() {
            const propValue = this.props[propNameToCheck], ready = !Utility.isObjectEmpty(propValue);
            return (
                <div className={`stateful-container slds-is-relative ${!ready && "slds-m-around_large"}`}>
                    {ready ? <WrappedComponent {...this.props}/> : <Spinner/>}
                </div>
            );
        }
    };
};

export default PropsLoader;