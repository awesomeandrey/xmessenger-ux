import React from "react";
import Events from "../../../../../../../../../model/events/application-events";

import {Settings} from "../../../../../../../../../model/services/core/UserService";
import {CustomEvents} from "../../../../../../../../../model/services/utility/EventsService";
import {InputPatterns, Utility} from "../../../../../../../../../model/services/utility/UtilityService";
import {Input, Spinner} from "react-lightning-design-system";

class ProfileInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            nameInput: {value: "", error: ""}
        };
    }

    componentDidMount() {
        const {user} = this.props;
        this.setState({nameInput: {value: user.name, error: ""}});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {user: prevUser, reset: prevReset} = prevProps, {user, reset} = this.props;
        if ((prevUser.name !== user.name) || (!prevReset && reset)) {
            this.setState({loading: false, nameInput: {value: user.name, error: ""}});
        }
    }

    handleChangeName = event => {
        const {user} = this.props, {nameInput} = this.state, pattern = InputPatterns.NAME;
        if (!Utility.matches(nameInput.value, pattern)) {
            nameInput.error = pattern.errorMessage;
            this.setState({nameInput});
        } else if (user.name !== nameInput.value) {
            nameInput.error = "";
            this.setState({loading: true, nameInput}, _ => {
                Settings.changeProfileInfo({...user, name: nameInput.value})
                    .then(_ => CustomEvents.fire({eventName: Events.USER.RELOAD}))
                    .then(_ => this.setState({loading: false}));
            });
        } else {
            nameInput.value = event.target.value;
            nameInput.error = "";
            this.setState({nameInput});
        }
    };

    render() {
        const {user} = this.props, {loading, nameInput} = this.state;
        return (
            <div className="slds-form--stacked slds-p-horizontal--small">
                <Input label="Name" iconRight="user" placeholder="Enter your name"
                       disabled={loading} error={nameInput.error} value={nameInput.value} required
                       onChange={event => this.setState({nameInput: {value: event.target.value}})}
                       onBlur={this.handleChangeName}/>
                <Input label="Username" value={Utility.decorateUsername(user.username)} iconRight="fallback" readOnly/>
                {loading && <div className="slds-float_left slds-is-relative slds-p-vertical--large slds-p-left_large">
                    <Spinner type="brand" container={false}/>
                </div>}
            </div>
        );
    }
}

export default ProfileInfo;