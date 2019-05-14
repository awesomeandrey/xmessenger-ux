import React, {Component} from 'react';
import AppContext from './AppContext';
import ApplicationEvents from "../../application-events";

import {subscribeFromClient} from "../../api/streaming/services/TopicsManager";
import {UserService} from "../core/UserService";
import {CustomEvents} from "../utility/EventsService";
import {postMessageToServiceWorker} from "../../api/streaming/services/ServiceWorkerRegistrator";
import {LocalEntities, LocalStorage} from "../utility/StorageService";
import {Utility} from "../utility/UtilityService";

class AppContextProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            richOnlineExperienceMode: "serviceWorker" in navigator,
            indicatorsMap: new Map()
        };
    }

    componentWillMount() {
        const {richOnlineExperienceMode} = this.state;
        if (richOnlineExperienceMode) {
            CustomEvents.register({
                eventName: ApplicationEvents.USER.INDICATOR_CHANGE, callback: ({detail}) => {
                    const {indicator} = detail, {indicatorsMap} = this.state;
                    if (indicatorsMap.has(indicator.id) && indicatorsMap.get(indicator.id).loggedIn !== indicator.loggedIn) {
                        this.setState({indicatorsMap: indicatorsMap.set(indicator.id, indicator)});
                    }
                }
            });
            CustomEvents.register({eventName: ApplicationEvents.CHAT.LOAD_ALL, callback: this.loadIndicators});
        }
        CustomEvents.register({eventName: ApplicationEvents.USER.RELOAD, callback: this.loadUser});
    }

    componentDidMount() {
        const {richOnlineExperienceMode} = this.state;
        if (Utility.isMobileDevice() || !richOnlineExperienceMode) {
            /**
             * If 'service worker' is not supported/allowed OR it's a mobile client
             * then client is directly subscribed to topics.
             * Intended for browsers which do not support service workers and mobile devices.
             */
            subscribeFromClient();
        } else {
            postMessageToServiceWorker({richNotificationsEnabled: LocalStorage.getItem(LocalEntities.RICH_NOTIFICATIONS)});
        }
        this.loadUser();
    }

    loadUser = _ => UserService.getUserInfo()
        .then(user => this.setState({user}, _ => {
            postMessageToServiceWorker({user});
        }));

    loadIndicators = _ => UserService.getUserIndicators()
        .then(indicators => this.setState({indicatorsMap: new Map(indicators.map(_ => [_.id, _]))}));

    render() {
        return (
            <AppContext.Provider value={this.state}>
                {this.props.children}
            </AppContext.Provider>
        );
    }
}

export default AppContextProvider;