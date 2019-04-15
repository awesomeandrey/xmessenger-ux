import React from "react";
import ToastEvents from "../../../../../../../common/components/toasts/events";
import EmptyArea from "../../../../../../../common/components/utils/EmptyArea";
import UserPicture from "../../../../../../../common/components/images/user-picture/UserPicture";
import RequestService from "../../../../../../../../model/services/core/RequestService";

import {UserService} from "../../../../../../../../model/services/core/UserService";
import {Utility} from "../../../../../../../../model/services/utility/UtilityService";
import {Button, Icon, Lookup} from "react-lightning-design-system";
import {CustomEvents} from "../../../../../../../../model/services/utility/EventsService";

class SearchTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            opened: false,
            options: [],
            selectedUser: null,
            requestedUsers: new Set()
        };
    }

    handleSearch = (query) => {
        if (!!query) {
            this.setState({loading: true, opened: false}, _ => {
                UserService.findUsers(query).then(options => {
                    options = options.map(user => ({
                        icon: "standard:avatar_loading",
                        label: user.name.concat(" - ").concat(Utility.decorateUsername(user.username)),
                        value: user.username,
                        userEntity: user
                    }));
                    this.setState({loading: false, opened: true, options: options});
                });
            });
        }
    };

    handleSelect = (option) => {
        this.handleBlur(_ => this.setState({selectedUser: !!option ? option.userEntity : null}));
    };

    handleBlur = callback => {
        this.setState({opened: false, loading: false}, callback);
    };

    sendFriendshipRequest = (targetUser) => {
        RequestService.sendRequest(targetUser)
            .then(_ => CustomEvents.fire({
                eventName: ToastEvents.SHOW,
                detail: {
                    icon: "notification", level: "success",
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
    };

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
                {!!selectedUser
                    ? <Card user={selectedUser} isRequestSent={isRequestSent}
                            sendRequest={_ => this.sendFriendshipRequest(selectedUser)}/>
                    : <EmptyArea title="Search for people by typing their names" icon="groups"/>}
            </div>
        );
    }
}

const Card = ({user, sendRequest, isRequestSent}) => {
    return (
        <figure className="slds-image slds-image--card slds-m-top_medium">
            <div className="slds-image__crop slds-image__crop--16-by-9 stretch">
                <UserPicture user={user}/>
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