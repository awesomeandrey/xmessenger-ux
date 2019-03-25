import React from "react";
import ToastEvents from "../../../../../../../common/components/toasts/events";
import EmptyArea from "../../../../../../../common/components/utils/EmptyArea";
import ScalableImage from "../../../../../../../common/components/images/scalable/ScalableImage";

import {UserService} from "../../../../../../../../model/services/core/UserService";
import {Utility} from "../../../../../../../../model/services/utility/UtilityService";
import {RequestService} from "../../../../../../../../model/services/core/RequestService";
import {Button, Icon, Lookup} from "react-lightning-design-system";
import {CustomEvents} from "../../../../../../../../model/services/utility/EventsService";

class SearchTab extends React.Component {
    constructor(props) {
        super(props);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.sendFriendshipRequest = this.sendFriendshipRequest.bind(this);
        this.state = {
            loading: false,
            opened: false,
            options: [],
            selectedUser: null,
            requestedUsers: new Set()
        };
    }

    handleSearch(query) {
        if (!!query) {
            this.setState({loading: true, opened: false});
            UserService.findUsers(query)
                .then(options => {
                    options = options.map(user => {
                        return {
                            icon: "standard:avatar_loading",
                            label: user.name.concat(" - ").concat(Utility.decorateUsername(user.username)),
                            value: user.username,
                            userEntity: user
                        };
                    });
                    return Promise.resolve(options);
                })
                .then(options => this.setState({loading: false, opened: true, options: options}));
        }
    }

    handleSelect(option) {
        this.handleBlur();
        let user = null;
        if (!!option) {
            user = option.userEntity;
        }
        this.setState({selectedUser: user});
    }

    handleBlur() {
        this.setState({opened: false, loading: false});
    }

    sendFriendshipRequest(targetUser) {
        RequestService.sendRequest(targetUser)
            .then(_ => CustomEvents.fire({
                eventName: ToastEvents.SHOW,
                detail: {
                    icon: "notification",
                    level: "success",
                    message: <span>Sent request to <strong>{targetUser.name}</strong></span>
                }
            }))
            .then(_ => this.setState({
                requestedUsers: this.state.requestedUsers.add(targetUser.username),
            }))
            .catch(error => CustomEvents.fire({
                eventName: ToastEvents.SHOW,
                detail: {icon: "warning", level: "warning", message: error.message}
            }));
    }

    render() {
        const {selectedUser, requestedUsers, options, opened, loading} = this.state,
            isRequestSent = !!selectedUser && requestedUsers.has(selectedUser.username);
        return (
            <div className="slds-scrollable_y height-inherit">
                <div className="slds-p-horizontal--small">
                    <Lookup label="Find fellow"
                            onSearchTextChange={this.handleSearch}
                            data={options}
                            onSelect={this.handleSelect}
                            onBlur={this.handleBlur}
                            loading={loading}
                            opened={opened}/>
                </div>
                <div className="slds-m-around--medium">
                    {!!selectedUser
                        ? <Card user={selectedUser}
                                sendRequest={_ => this.sendFriendshipRequest(selectedUser)}
                                isRequestSent={isRequestSent}/>
                        : <EmptyArea title="Search for people by typing their names"
                                     icon="utility:groups"/>}
                </div>
            </div>
        );
    }
}

const Card = ({user, sendRequest, isRequestSent}) => {
    return (
        <figure className="slds-image slds-image--card">
            <div className="slds-image__crop slds-image__crop--16-by-9 stretch">
                <ScalableImage title={user.name} src={UserService.composeUserPictureUrl(user)}/>
            </div>
            <figcaption className="slds-image__title slds-image__title--card">
                <div className="slds-clearfix" style={{width: "100%"}}>
                    <h3 className="slds-float_left">
                        {user.name}<br/>
                        <small>{Utility.decorateUsername(user.username)}</small>
                    </h3>
                    <div className="slds-float_right">
                        {isRequestSent && <Icon icon="utility:check" size="medium"/>}
                        {!isRequestSent && <Button type="neutral" onClick={sendRequest}>Send Request</Button>}
                    </div>
                </div>
            </figcaption>
        </figure>
    );
};

export default SearchTab;