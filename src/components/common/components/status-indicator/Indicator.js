import React from "react";
import ApplicationEvents from "./../../../../model/events/application-events";
import AppContext from "../../../../model/services/context/AppContext";

import {CustomEvents} from "../../../../model/services/utility/EventsService";

import "./styles.css";

class Indicator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOnline: false
        };
    }

    componentWillMount() {
        CustomEvents.register({
            eventName: ApplicationEvents.USER.INDICATOR_CHANGE,
            callback: event => {
                const {} = event, {user} = this.props;
                // TODO - switch user indicator;
            }
        });
    }

    render() {
        const {isOnline} = this.state, {children} = this.props;
        return (
            <AppContext.Consumer>
                {context => (
                    <div className={`slds-is-relative ${context.richOnlineExperienceMode && "indicator"}`}>
                        {children}
                        <span className={`${isOnline && "online"}`}/>
                    </div>
                )}
            </AppContext.Consumer>
        );
    }
}

export default Indicator;