import React, {Component} from 'react';
import AppContext from './AppContext';
import Events from "../../events/application-events";
import subscribeToTopics from "../../api/streaming/TopicsSubscriber";

import {UserService} from "../core/UserService";
import {CustomEvents} from "../utility/EventsService";
import {registerServiceWorker} from "../../api/streaming/service-worker/PushingService";

class AppContextProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null
        };
    }

    componentWillMount() {
        CustomEvents.register({eventName: Events.USER.RELOAD, callback: this.loadUser});
        // Subscribe to topics;
        // CustomEvents.register({eventName: "load", callback: subscribeToTopics});
    }

    componentDidMount() {
        this.loadUser();

        registerServiceWorker();
    }

    loadUser = _ => UserService.getUserInfo()
        .then(user => this.setState({currentUser: user}));

    render() {
        const {currentUser} = this.state;
        return (
            <AppContext.Provider value={{
                user: currentUser
            }}>
                {this.props.children}
            </AppContext.Provider>
        );
    }
}

export default AppContextProvider;