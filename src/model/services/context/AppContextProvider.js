import React, {Component} from 'react';
import AppContext from './AppContext';
import ApplicationEvents from "../../application-events";

import {UserService} from "../core/UserService";
import {CustomEvents} from "../utility/EventsService";
import {postMessageToServiceWorker} from "../../api/streaming/services/ServiceWorkerRegistrator";
import {SessionEntities, SessionStorage} from "../utility/StorageService";

class AppContextProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            indicatorsMap: new Map()
        };
    }

    componentWillMount() {
        CustomEvents.register({
            eventName: ApplicationEvents.USER.INDICATOR_CHANGE, callback: ({detail}) => {
                const {indicator} = detail, {indicatorsMap} = this.state;
                if (indicatorsMap.has(indicator.id) && indicatorsMap.get(indicator.id).active !== indicator.active) {
                    this.setState({indicatorsMap: indicatorsMap.set(indicator.id, indicator)});
                }
            }
        });
        CustomEvents.register({eventName: ApplicationEvents.CHAT.LOAD_ALL, callback: this.loadIndicators});
        CustomEvents.register({eventName: ApplicationEvents.USER.RELOAD, callback: this.loadUser});
    }

    componentDidMount() {
        // Retrieve current user info;
        this.loadUser();
        // Initialize active chat (if present);
        const activeChat = SessionStorage.getItem(SessionEntities.ACTIVE_CHAT);
        if (!!activeChat) {
            CustomEvents.fire({eventName: ApplicationEvents.CHAT.SELECT, detail: {selectedChat: activeChat}});
        }
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