import React from "react";
import Icon from "@salesforce/design-system-react/module/components/icon";

import {applyTheme, THEMES, getCurrentTheme} from "../../../../../../../../../model/services/utility/ThemingService";

class ThemePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTheme: getCurrentTheme(),
            themes: THEMES
        };
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
        <div className={`slds-col slds-p-vertical--large slds-m-horizontal_x-small ${!selected && 'hoverable'}`}
             style={style} onClick={selected ? null : onClick}>
            {selected ? <Icon category="utility" name="check" size="small"/> : <span>{title}</span>}
        </div>
    );
};

export default ThemePicker;