import React from 'react';

import {
    applyTheme,
    getAvailableThemes,
    getCurrentTheme
} from "../../../../../../../../../model/services/utility/ThemingService";
import {Icon} from "react-lightning-design-system";

class ThemePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTheme: null,
            themes: []
        };
    }

    componentDidMount() {
        this.setState({
            selectedTheme: getCurrentTheme(),
            themes: getAvailableThemes()
        });
    }

    handleChooseTheme(theme) {
        applyTheme(theme);
        this.setState({selectedTheme: theme});
    }

    render() {
        const {selectedTheme, themes} = this.state, themeItems = themes.map((theme, index) => {
            return <ThemeItem key={index} selected={selectedTheme.title === theme.title}
                              theme={theme} onClick={_ => this.handleChooseTheme(theme)}/>;
        });
        return (
            <div className="slds-align_absolute-center">
                <div className="slds-grid slds-gutters slds-text-align--center ">{themeItems}</div>
            </div>
        );
    }
}

const ThemeItem = ({theme, selected, onClick}) => {
    const {title, bgColor, textColor} = theme, style = {
        color: textColor,
        backgroundColor: bgColor,
        border: "1px solid silver",
        borderRadius: "5px",
        minWidth: "5rem"
    };
    return (
        <div className={`slds-col slds-p-vertical--large slds-m-horizontal_x-small ${!selected && 'hover'}`}
             style={style} onClick={selected ? null : onClick}>
            {selected ? <Icon icon="utility:check" size="small"/> : <span>{title}</span>}
        </div>
    );
};

export default ThemePicker;