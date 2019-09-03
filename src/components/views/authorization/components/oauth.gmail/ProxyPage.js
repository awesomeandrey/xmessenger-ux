import React from "react";
import Countdown from "react-countdown-now";
import NotificationEvents from "../../../../common/components/notifications/notification-events";
import GmailService from "../../../../../model/services/core/integration/google/GmailService";
import Button from "@salesforce/design-system-react/module/components/button";
import Modal from "@salesforce/design-system-react/module/components/modal";

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
                    eventName: NotificationEvents.SHOW,
                    detail: {level: "error", message: "Internal error occurred, please address support."},
                    callback: _ => console.log(JSON.stringify(error))
                });
            });
    }

    countdownRenderer = ({hours, minutes, seconds, completed}) => {
        if (completed) {
            // Render a complete state;
            return <Button variant="brand" label="Redirect" onClick={_ => Navigation.toHome({replace: true})}/>;
        } else {
            // Render a countdown;
            return <span>{seconds} sec</span>;
        }
    };

    render() {
        return (
            <div style={{height: "100vh"}}>
                <Modal dismissible={false} ariaHideApp={false}
                       footer={[
                           <Countdown key={Utility.generateUniqueId()}
                                      date={Date.now() + 7000} renderer={this.countdownRenderer}/>
                       ]}
                       isOpen={true} prompt="info" size="medium" title={"OAuth Proxy Page"}>
                    <div className="slds-p-around--small slds-text-align_center">
                        <p>Please, wait while this proxy page authorizes you.</p>
                        <p>If nothing happens, click "Redirect" button.</p>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default ProxyPage;