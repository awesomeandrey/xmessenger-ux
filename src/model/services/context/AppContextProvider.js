import React, {Component} from 'react';
import AppContext from './AppContext';
import ApplicationEvents from "../../events/application-events";
import subscribeToTopics from "../../api/streaming/services/TopicsSubscriberFromClient";
import registerServiceWorker from "../../api/streaming/services/ServiceWorkerRegistrator";

import {UserService} from "../core/UserService";
import {CustomEvents} from "../utility/EventsService";

class AppContextProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null
        };
    }

    componentWillMount() {
        CustomEvents.register({eventName: ApplicationEvents.USER.RELOAD, callback: this.loadUser});
    }

    componentDidMount() {
        this.loadUser();
        try {
            // Register service worker for rich user experience;
            registerServiceWorker();
        } catch (e) {
            console.error(e);
            // If SW is not supported/allowed then client is subscribed to topics by himself;
            subscribeToTopics();
        }
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