import React from "react";
import ToastEvents from "../../../../../../../common/components/toasts/toasts-events";
import EmptyArea from "../../../../../../../common/components/utils/EmptyArea";
import RequestService from "../../../../../../../../model/services/core/RequestService";
import Lookup from "@salesforce/design-system-react/module/components/lookup/lookup";
import UserCard from "./UserCard";
import Spinner from "@salesforce/design-system-react/module/components/spinner";

import {UserService} from "../../../../../../../../model/services/core/UserService";
import {Utility} from "../../../../../../../../model/services/utility/UtilityService";
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
                    options = options.map(foundUser => ({
                        label: Utility.formatUserInfo(foundUser), foundUser
                    }));
                    this.setState({loading: false, opened: true, options: options});
                });
            });
        }
    };

    handleSelect = (option) => this.setState({
        selectedUser: option.foundUser,
        opened: false
    });

    sendFriendshipRequest = (targetUser) => {
        RequestService.sendRequest(targetUser)
            .then(_ => CustomEvents.fire({
                eventName: ToastEvents.SHOW,
                detail: {
                    level: "success",
                    message: <span>Sent request to <strong>{targetUser["name"]}</strong></span>
                }
            }))
            .then(_ => this.setState({
                requestedUsers: this.state.requestedUsers.add(targetUser["username"]),
            }))
            .catch(error => CustomEvents.fire({
                eventName: ToastEvents.SHOW,
                detail: {level: "warning", message: error.message}
            }));
    };

    render() {
        const {selectedUser, requestedUsers, options, opened, loading} = this.state,
            isRequestSent = !!selectedUser && requestedUsers.has(selectedUser.username);
        return (
            <div className="slds-p-horizontal--small">
                <Lookup emptyMessage="No items found."
                        placeholder="Type here..."
                        isOpen={opened}
                        label="Find fellow"
                        onChange={this.handleSearch}
                        onSelect={this.handleSelect}
                        onBlur={_ => this.setState({opened: false})}
                        options={options}
                />
                {loading && <Spinner variant="brand" size="small"/>}
                {!!selectedUser
                    ? <UserCard user={selectedUser} alreadySent={isRequestSent}
                                onSendRequest={_ => this.sendFriendshipRequest(selectedUser)}/>
                    : <EmptyArea title="Search for people by typing their names." icon="groups"/>}
            </div>
        );
    }
}

export default SearchTab;