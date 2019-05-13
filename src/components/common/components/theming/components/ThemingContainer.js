import React from "react";

import {CustomEvents} from "../../../../../model/services/utility/EventsService";
import {getCurrentTheme, ON_APPLY_THEME, THEMES} from "../model/themes-manager";
import {LocalEntities, LocalStorage} from "../../../../../model/services/utility/StorageService";

import "../styles/theming.css";

class ThemingContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: THEMES.DEFAULT
        };
    }

    componentDidMount() {
        CustomEvents.register({
            eventName: ON_APPLY_THEME, callback: event => this.applyTheme(event.detail)
        });

        const selectedTheme = getCurrentTheme();
        if (!!selectedTheme && selectedTheme.className !== THEMES.DEFAULT.className) {
            this.applyTheme(selectedTheme);
        }
    }

    applyTheme = theme => {
        LocalStorage.setItem({key: LocalEntities.ACTIVE_THEME, value: theme});
        this.setState({theme});
    };

    render() {
        const {theme} = this.state;
        return (
            <div className={theme.className}>
                {this.props.children}
            </div>
        );
    }
}

export default ThemingContainer;