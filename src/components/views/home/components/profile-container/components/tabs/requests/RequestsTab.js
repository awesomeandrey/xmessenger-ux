import React from "react";
import EmptyArea from "../../../../../../../common/components/utils/EmptyArea";
import Events from "../../../../../../../../model/events/application-events";
import ToastEvents from "../../../../../../../common/components/toasts/events";
import UserPicture from "../../../../../../../common/components/images/user-picture/UserPicture";

import {Utility} from "../../../../../../../../model/services/utility/UtilityService";
import {RequestService} from "../../../../../../../../model/services/core/RequestService";
import {Button, ButtonGroup} from "react-lightning-design-system";
import {CustomEvents} from "../../../../../../../../model/services/utility/EventsService";

const NOTIFICATION_BLUEPRINTS = {
    onRespondToRequest: request => {
        CustomEvents.fire({
            eventName: ToastEvents.SHOW,
            detail: {
                icon: "notification", level: "success", message: (
                    <span>Friendship request from <b>{request.sender.name} </b>
                        was <b>{request.approved ? "accepted" : "declined"}</b></span>
                )
            }
        })
    },
    onRespondToRequestError: error => {
        CustomEvents.fire({
            eventName: ToastEvents.SHOW,
            detail: {icon: "warning", level: "warning", message: error.message}
        })
    },
    onProcessRequest: request => {
        CustomEvents.fire({
            eventName: ToastEvents.SHOW,
            detail: {
                icon: "notification",
                message: (<span><b>{request.recipient.name} </b>
                    {request.approved ? "accepted" : "declined"} your friendship request.</span>)
            }
        });
    },
    onSendRequest: callback => {
        CustomEvents.fire({
            eventName: ToastEvents.SHOW,
            detail: {icon: "notification", message: "There is a new friendship request. Check it out!"},
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
            eventName: Events.REQUEST.SEND,
            callback: event => {
                const {user} = this.props, {request} = event.detail;
                if (user.id === request.recipient.id) {
                    NOTIFICATION_BLUEPRINTS.onSendRequest(this.loadRequests);
                }
            }
        });

        CustomEvents.register({
            eventName: Events.REQUEST.PROCESS,
            callback: event => {
                const {user} = this.props, {request} = event.detail;
                if (user.id === request.recipient.id) {
                    if (request.approved) {
                        CustomEvents.fire({eventName: Events.CHAT.LOAD_ALL, callback: this.loadRequests});
                    }
                } else if (user.id === request.sender.id) {
                    NOTIFICATION_BLUEPRINTS.onProcessRequest(request);
                    if (request.approved) {
                        CustomEvents.fire({eventName: Events.CHAT.LOAD_ALL});
                    }
                }
            }
        });
    }

    componentDidMount() {
        this.loadRequests();
    }

    loadRequests = _ => {
        RequestService.getRequests()
            .then(requests => this.setState({requests: requests || []}, _ => {
                CustomEvents.fire({eventName: Events.REQUEST.CALCULATE, detail: this.state.requests.length || 0});
            }));
    };

    respondToRequest = (request, isAccepted) => {
        request.approved = isAccepted;
        RequestService.respondToRequest(request)
            .then(request => NOTIFICATION_BLUEPRINTS.onRespondToRequest(request),
                error => NOTIFICATION_BLUEPRINTS.onRespondToRequestError(error));
    };

    render() {
        const {requests} = this.state, requestItems = requests.map(request =>
            <RequestItem key={request.id} request={request} processRequest={this.respondToRequest}/>);
        return (
            <div className="slds-scrollable_y height-inherit">
                {requestItems.length === 0
                    ? <EmptyArea title="There are no requests for now"
                                 className="height-inherit" icon="utility:announcement"/>
                    : <div className="slds-text-longform">{requestItems}</div>}
            </div>
        );
    }
}

const RequestItem = ({request, processRequest}) => {
    const {sender} = request, {name, username} = sender;
    return (
        <div className="slds-media slds-box slds-box_x-small slds-p-vertical--x-small slds-m-top_x-small">
            <div className="slds-media__figure">
                <div className="slds-avatar slds-avatar_large">
                    <UserPicture user={sender}/>
                </div>
            </div>
            <div className="slds-media__body">
                <p className="slds-float_left">
                    <span className="slds-text-body_regular">{name}</span><br/>
                    <span className="slds-text-body_small slds-text-color_weak">
                       {Utility.decorateUsername(username)}</span>
                </p>
                <ButtonGroup className="slds-float_right">
                    <Button type="brand" onClick={_ => processRequest(request, true)}>Accept</Button>
                    <Button type="destructive" onClick={_ => processRequest(request, false)}>Reject</Button>
                </ButtonGroup>
            </div>
        </div>
    );
};

export default RequestsTab;