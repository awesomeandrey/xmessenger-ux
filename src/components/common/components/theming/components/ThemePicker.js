import React from "react";
import Icon from "@salesforce/design-system-react/module/components/icon";

import {CustomEvents} from "../../../../../model/services/utility/EventsService";
import {ON_APPLY_THEME, getCurrentTheme, THEMES} from "../model/themes-manager";

class ThemePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTheme: getCurrentTheme(),
        };
    }

    handleChooseTheme = (theme) => {
        CustomEvents.fire({
            eventName: ON_APPLY_THEME, detail: theme, callback: _ => {
                this.setState({selectedTheme: theme});
            }
        });
    };

    render() {
        const {selectedTheme} = this.state;
        return (
            <div className="slds-align_absolute-center">
                <div className="slds-grid slds-gutters slds-text-align--center">
                    {(Object.values(THEMES).map((theme, index) =>
                        <ThemeItem key={index} theme={theme}
                                   selected={selectedTheme.title === theme.title}
                                   onClick={_ => this.handleChooseTheme(theme)}/>
                    ))}
                </div>
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
        <div className={`slds-m-horizontal_x-small ${theme.className}`}>
            <div className={`slds-col slds-p-vertical--large theme-marker ${!selected && "hoverable"}`}
                 style={style} onClick={selected ? null : onClick}>
                {selected ? <Icon category="utility" name="check" size="x-small"/> : <span>{title}</span>}
            </div>
        </div>
    );
};

export default ThemePicker;