import React, {Component} from 'react';
import AppContext from './AppContext';
import ApplicationEvents from "../../events/application-events";

import {subscribeFromClient} from "../../api/streaming/services/TopicsSubscriber";
import {UserService} from "../core/UserService";
import {CustomEvents} from "../utility/EventsService";
import {postMessageToServiceWorker} from "../../api/streaming/services/ServiceWorkerRegistrator";

class AppContextProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            richOnlineExperienceMode: "serviceWorker" in navigator
        };
    }

    componentWillMount() {
        CustomEvents.register({eventName: ApplicationEvents.USER.RELOAD, callback: this.loadUser});
    }

    componentDidMount() {
        const {richOnlineExperienceMode} = this.state;
        if (!richOnlineExperienceMode) {
            /**
             * If 'service worker' is not supported/allowed then client is directly subscribed to topics.
             * Intended for browsers/devices which do not support service workers.
             */
            subscribeFromClient();
        }
        this.loadUser();
    }

    loadUser = _ => UserService.getUserInfo()
        .then(user => this.setState({user}, _ => {
            postMessageToServiceWorker({user});
        }));

    render() {
        return (
            <AppContext.Provider value={this.state}>
                {this.props.children}
            </AppContext.Provider>
        );
    }
}

export default AppContextProvider;