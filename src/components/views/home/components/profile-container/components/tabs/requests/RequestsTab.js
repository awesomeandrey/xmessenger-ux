import React from "react";
import EmptyArea from "../../../../../../../common/components/utils/EmptyArea";
import ApplicationEvents from "../../../../../../../../model/application-events";
import NotificationEvents from "../../../../../../../common/components/notifications/notification-events";
import RequestService from "../../../../../../../../model/services/core/RequestService";
import RequestItem from "./RequestItem";

import {CustomEvents} from "../../../../../../../../model/services/utility/EventsService";

const NOTIFICATION_BLUEPRINTS = {
    onRespondToRequest: request => {
        CustomEvents.fire({
            eventName: NotificationEvents.SHOW,
            detail: {
                level: "success",
                message:
                    <span>Friendship request from <b>{request.sender.name}</b> was <b>{request.approved ? "accepted" : "declined"}</b>.</span>
            }
        });
    },
    onRespondToRequestError: error => {
        CustomEvents.fire({
            eventName: NotificationEvents.SHOW,
            detail: {level: "warning", message: error.message}
        });
    },
    onProcessRequest: request => {
        CustomEvents.fire({
            eventName: NotificationEvents.SHOW,
            detail: {
                message: <span><b>{request.recipient.name}</b> {request.approved ? "accepted" : "declined"} your friendship request.</span>
            }
        });
    },
    onSendRequest: callback => {
        CustomEvents.fire({
            eventName: NotificationEvents.SHOW,
            detail: {message: "There is a new friendship request. Check it out!"},
            callback: callback
        });
    }
};

class RequestsTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            requests: []
        };
    }

    componentWillMount() {
        CustomEvents.register({
            eventName: ApplicationEvents.REQUEST.SEND,
            callback: event => {
                const {user} = this.props, {request} = event.detail;
                if (user["id"] === request["recipient"]["id"]) {
                    NOTIFICATION_BLUEPRINTS.onSendRequest(this.loadRequests);
                }
            }
        });
        CustomEvents.register({
            eventName: ApplicationEvents.REQUEST.PROCESS,
            callback: event => {
                const {user} = this.props, {request} = event.detail;
                if (user["id"] === request["recipient"]["id"]) {
                    if (request["approved"]) {
                        CustomEvents.fire({eventName: ApplicationEvents.CHAT.LOAD_ALL});
                    }
                    this.loadRequests();
                } else if (user["id"] === request["sender"]["id"]) {
                    NOTIFICATION_BLUEPRINTS.onProcessRequest(request);
                    if (request["approved"]) {
                        CustomEvents.fire({eventName: ApplicationEvents.CHAT.LOAD_ALL});
                    }
                }
            }
        });
        CustomEvents.register({eventName: ApplicationEvents.REQUEST.LOAD_ALL, callback: this.loadRequests});
    }

    componentDidMount() {
        CustomEvents.fire({eventName: ApplicationEvents.REQUEST.LOAD_ALL});
    }

    loadRequests = _ => {
        RequestService.getRequests()
            .then((requests = []) => this.setState({requests}, _ => {
                CustomEvents.fire({eventName: ApplicationEvents.REQUEST.CALCULATE, detail: requests.length});
            }));
    };

    respondToRequest = (request, isAccepted) => {
        request["approved"] = isAccepted;
        RequestService.respondToRequest(request)
            .then(request => NOTIFICATION_BLUEPRINTS.onRespondToRequest(request),
                error => NOTIFICATION_BLUEPRINTS.onRespondToRequestError(error));
    };

    render() {
        const {requests} = this.state, requestItems = requests.map(request =>
            <RequestItem key={request["id"]} request={request} onProcess={this.respondToRequest}/>);
        return (
            <div className="slds-scrollable_y">
                {!requestItems.length
                    ? <EmptyArea title="There are no requests for now." icon="announcement"/>
                    : <div className="slds-text-longform">{requestItems}</div>}
            </div>
        );
    }
}

export default RequestsTab;