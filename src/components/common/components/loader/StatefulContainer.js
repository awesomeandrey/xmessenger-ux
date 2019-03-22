import React, {Component} from "react";
import {Spinner} from "react-lightning-design-system";

const StatefulContainer = (loadingProp = "loading") => WrappedComponent => {
    return class LoadingHOC extends Component {
        render() {
            const loading = typeof this.props[loadingProp] === "boolean" && this.props[loadingProp];
            return (
                <div>
                    {loading && <Spinner/>}
                    <WrappedComponent {...this.props}/>
                </div>
            );
        }
    };
};

export default StatefulContainer;