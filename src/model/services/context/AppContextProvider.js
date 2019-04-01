import React, {Component} from 'react';
import AppContext from './AppContext';
import Events from "../../../components/views/home/model/HomePageEvents";

import {UserService} from "../core/UserService";
import {CustomEvents} from "../utility/EventsService";

class AppContextProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null
        }
    }

    componentWillMount() {
        CustomEvents.register({
            eventName: Events.USER.RELOAD,
            callback: this.reloadCurrentUser
        });
    }

    componentDidMount() {
        this.reloadCurrentUser();
    }

    reloadCurrentUser = _ => UserService.getCurrentUser(true)
        .then(user => this.setState({currentUser: user}));

    render() {
        return (
            <AppContext.Provider value={{
                user: this.state.currentUser,
                reloadUser: this.reloadCurrentUser
            }}>
                {this.props.children}
            </AppContext.Provider>
        );
    }
}

export default AppContextProvider;