import React from "react";
import Countdown from "react-countdown-now";
import Events from "../../../../common/components/toasts/events";
import GmailService from "../../../../../model/services/core/GmailService";

import {Button} from "react-lightning-design-system";
import {CustomEvents} from "../../../../../model/services/utility/EventsService";
import {Navigation} from "../../../../../model/services/utility/NavigationService";
import {Utility} from "../../../../../model/services/utility/UtilityService";

class ProxyPage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const accessToken = Utility.getParamFromUrl({paramName: "access_token"});
        GmailService.authenticate(accessToken)
            .then(_ => Navigation.toHome({replace: true}), error => {
                CustomEvents.fire({
                    eventName: Events.SHOW,
                    detail: {icon: "error", message: "Internal error occurred, please address support."},
                    callback: _ => console.log(error)
                });
            });
    }

    countdownRenderer = ({hours, minutes, seconds, completed}) => {
        if (completed) {
            // Render a complete state;
            return <Button type="brand" label="Redirect" onClick={_ => Navigation.toHome({replace: true})}/>;
        } else {
            // Render a countdown;
            return <span>{seconds} sec</span>;
        }
    };

    render() {
        return (
            <div className="proxy-page-container">
                <div className="slds-modal slds-fade-in-open" aria-hidden="false" role="dialog">
                    <div className="slds-modal__container">
                        <div className="slds-modal__header">
                            <h2 className="slds-text-heading--medium">OAuth Proxy Page</h2>
                        </div>
                        <div className="slds-modal__content">
                            <div className="slds-p-around--small">
                                <p>Please, wait while this proxy page authorizes you.</p>
                                <p>If nothing happens, click "Redirect" button.</p>
                            </div>
                        </div>
                        <div className="slds-modal__footer">
                            <Countdown date={Date.now() + 7000} renderer={this.countdownRenderer}/>
                        </div>
                    </div>
                </div>
                <div className="slds-modal-backdrop slds-modal-backdrop--open"/>
            </div>
        );
    }
}

export default ProxyPage;