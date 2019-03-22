import React from "react";
import Image from "../../../../../../common/components/images/plain/Image";
import EmptyArea from "../../../../../../common/components/utils/EmptyArea";
import Events from "../../../../model/HomePageEvents";
import ToastEvents from "../../../../../../common/components/toasts/events";

import {UserService} from "../../../../../../../model/services/core/UserService";
import {Utility} from "../../../../../../../model/services/utility/UtilityService";
import {RequestService} from "../../../../../../../model/services/core/RequestService";
import {Button, ButtonGroup} from "react-lightning-design-system";
import {CustomEvents} from "../../../../../../../model/services/utility/EventsService";

class RequestsTab extends React.Component {
    constructor(props) {
        super(props);
        this.loadRequests = this.loadRequests.bind(this);
        this.processRequest = this.processRequest.bind(this);
        this.state = {
            requests: []
        };
    }

    componentWillMount() {
        CustomEvents.register({
            eventName: Events.REQUEST.SEND,
            callback: event => {
                const {request} = event.detail;
                UserService.getCurrentUser()
                    .then(user => {
                        return user.id === request.recipient.id
                            ? Promise.resolve(request)
                            : Promise.reject("No relation to current user.");
                    })
                    .then(_ => {
                        CustomEvents.fire({
                            eventName: ToastEvents.SHOW,
                            detail: {
                                icon: "notification",
                                message: "There is a new friendship request. Check it out!"
                            }
                        });
                        this.loadRequests();
                    }, reason => {
                    });
            }
        });

        CustomEvents.register({
            eventName: Events.REQUEST.PROCESS,
            callback: event => {
                const {request} = event.detail;
                UserService.getCurrentUser()
                    .then(user => {
                        if (user.id === request.recipient.id) {
                            this.loadRequests();
                            return Promise.resolve(request);
                        } else if (user.id === request.sender.id) {
                            CustomEvents.fire({
                                eventName: ToastEvents.SHOW,
                                detail: {
                                    icon: "notification",
                                    message:
                                        <span><b>{request.recipient.name}</b> {request.approved ? "accepted" : "declined"} your friendship request.</span>
                                }
                            });
                            return Promise.resolve(request);
                        } else {
                            return Promise.reject("No relation to current user.");
                        }
                    })
                    .then(request => {
                        if (request.approved) {
                            CustomEvents.fire({eventName: Events.CHAT.LOAD_ALL});
                        }
                    }, reason => {
                    });
            }
        });
    }

    componentDidMount() {
        this.loadRequests();
    }

    loadRequests() {
        RequestService.getRequests()
            .then(requests => this.setState({requests: requests || []}))
            .then(_ => CustomEvents.fire({
                eventName: Events.REQUEST.CALCULATE,
                detail: this.state.requests.length || 0
            }));
    }

    processRequest(request, isAccepted) {
        request.approved = isAccepted;
        RequestService.processRequest(request)
            .then(request => CustomEvents.fire({
                    eventName: ToastEvents.SHOW,
                    detail: {
                        icon: "notification",
                        level: "success",
                        message:
                            <span>Friendship request from <b>{request.sender.name}</b> was <b>{request.approved ? "accepted" : "declined"}</b></span>
                    }
                })
                , error => CustomEvents.fire({
                    eventName: ToastEvents.SHOW,
                    detail: {
                        icon: "warning",
                        level: "warning",
                        message: error.message
                    }
                }));
    }

    render() {
        const {requests} = this.state, requestItems = requests.map(request =>
            <RequestItem key={request.id} request={request}
                         processRequest={this.processRequest}/>);
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
                    <Image title={name} src={UserService.composeUserPictureUrl(sender)}/>
                </div>
            </div>
            <div className="slds-media__body">
                <p className="slds-float_left">
                    <span className="slds-text-body_regular">{name}</span><br/>
                    <span className="slds-text-body_small slds-text-color_weak">
                        {Utility.decorateUsername(username)}</span>
                </p>
                <ButtonGroup className="slds-float_right">
                    <Button type="brand" onClick={_ => processRequest(request, true)}>
                        Accept
                    </Button>
                    <Button type="destructive" onClick={_ => processRequest(request, false)}>
                        Reject
                    </Button>
                </ButtonGroup>
            </div>
        </div>
    );
};

export default RequestsTab;