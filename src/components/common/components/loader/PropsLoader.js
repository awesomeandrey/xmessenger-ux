import React, {Component} from "react";

import {Spinner} from "react-lightning-design-system";
import {Utility} from "../../../../model/services/utility/UtilityService";

const PropsLoader = propNameToCheck => WrappedComponent => {
    if (typeof propNameToCheck !== "string") throw "[PropsLoader] -> 'propToCheck' should be of string type.";
    return class HOC extends Component {
        render() {
            const propValue = this.props[propNameToCheck], ready = !Utility.isObjectEmpty(propValue);
            return (
                <div className={`stateful-container ${!ready && "slds-p-vertical--medium"}`}>
                    {ready ? <WrappedComponent {...this.props}/> : (<div className="slds-is-relative"><Spinner/></div>)}
                </div>
            );
        }
    };
};

export default PropsLoader;