import React from "react";
import Countdown from "react-countdown-now";
import ToastContainer from "../../../common/components/toasts/components/ToastContainer";
import Events from "../../../common/components/toasts/events";

import {Button, Modal, ModalContent, ModalFooter, ModalHeader} from "react-lightning-design-system";
import {OAuthService} from "../../../../model/services/core/GmailService";
import {CustomEvents} from "../../../../model/services/utility/EventsService";
import {Navigation} from "../../../../model/services/utility/NavigationService";

class ProxyPage extends React.Component {
    constructor(props) {
        super(props);
        this.countdownRenderer = this.countdownRenderer.bind(this);
    }

    componentWillMount() {
        const payload = OAuthService.parseUrlFromAuthorizationServer(window.location.hash.substring(1));
        if (payload == null) {
            Navigation.toHome({replace: true});
        } else {
            OAuthService.login(payload.access_token)
                .then(_ => Navigation.toHome({replace: true}),
                    error => {
                        const errorStackTrace = JSON.stringify(error);
                        console.error(errorStackTrace);
                        // Display message;
                        CustomEvents.fire({
                            eventName: Events.SHOW,
                            detail: {
                                icon: "error",
                                message: "Internal error occurred, please address support."
                            }
                        });
                    });
        }
    }

    countdownRenderer({hours, minutes, seconds, completed}) {
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
            <ToastContainer>
                <Modal opened={true}>
                    <ModalHeader title="OAuth Proxy Page"/>
                    <ModalContent>
                        <div className="slds-p-around--small">
                            <p>
                                Please, wait while this proxy page authorizes you.
                            </p>
                            <p>
                                If nothing happens, click "Redirect" button.
                            </p>
                        </div>
                    </ModalContent>
                    <ModalFooter directional={false}>
                        <Countdown date={Date.now() + 7000} renderer={this.countdownRenderer}/>
                    </ModalFooter>
                </Modal>
            </ToastContainer>
        );
    }
}

export default ProxyPage;