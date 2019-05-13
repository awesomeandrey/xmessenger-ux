import React from "react";
import Events from "../../../../../../../../../model/application-events";
import Spinner from "@salesforce/design-system-react/module/components/spinner";
import Input from "@salesforce/design-system-react/module/components/input";
import InputIcon from "@salesforce/design-system-react/module/components/icon/input-icon";
import MaskedInput from "../../../../../../../../common/components/inputs/MaskedInput";

import {Settings} from "../../../../../../../../../model/services/core/UserService";
import {CustomEvents} from "../../../../../../../../../model/services/utility/EventsService";
import {InputPatterns, Utility} from "../../../../../../../../../model/services/utility/UtilityService";

class ProfileInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            name: ""
        };
    }

    componentDidMount() {
        const {user} = this.props;
        this.setState({name: user.name});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {user: prevUser, reset: prevReset} = prevProps, {user, reset} = this.props;
        if ((prevUser.name !== user.name) || (!prevReset && reset)) {
            this.setState({loading: false, name: user.name});
        }
    }

    handleChangeName = _ => {
        const {user} = this.props, {name} = this.state, pattern = InputPatterns.NAME;
        if (!!name && Utility.matches(name, pattern) && user.name !== name) {
            this.setState({loading: true}, _ => {
                Settings.changeProfileInfo({...user, name})
                    .then(_ => CustomEvents.fire({eventName: Events.USER.RELOAD}))
                    .then(_ => this.setState({loading: false}));
            });
        }
    };

    render() {
        const {user} = this.props, {loading, name} = this.state;
        return (
            <div className="slds-form--stacked slds-p-horizontal--small">
                <MaskedInput label="Name" placeholder="Enter your name"
                             iconRight={<InputIcon name="user" category="utility"/>}
                             disabled={loading} required
                             value={name} pattern={InputPatterns.NAME}
                             onChange={name => this.setState({name})}
                             onBlur={this.handleChangeName}/>
                <Input label="Username" disabled
                       value={Utility.decorateUsername(user.username)}
                       iconRight={<InputIcon name="fallback" category="utility"/>}/>
                {loading && <div className="slds-float_left slds-is-relative slds-p-vertical--large slds-p-left_large">
                    <Spinner variant="brand" size="small"/>
                </div>}
            </div>
        );
    }
}

export default ProfileInfo;