import React, {Component} from 'react';
import AppContext from './AppContext';

import {UserService} from "../core/UserService";

class AppContextProvider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: {}
        }
    }

    reloadCurrentUser = _ => UserService.getCurrentUser(true)
        .then(u => this.setState({currentUser: u}));

    componentDidMount() {
        this.reloadCurrentUser();
    }

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