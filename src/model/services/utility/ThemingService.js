import {LocalStorage, LocalEntities} from "./StorageService";

const THEMES = [
    {
        title: "Default",
        bgColor: "#dddbda",
        textColor: "#706e6b",
        cssVariables: {
            "--col-bg": "#dddbda",
            "--col-text": "#706e6b"
        }
    },
    {
        title: "Green",
        bgColor: "#04844b",
        textColor: "#fff",
        cssVariables: {
            "--col-bg": "#04844b",
            "--col-text": "#fff"
        }
    },
    {
        title: "Orange",
        bgColor: "#ffb75d",
        textColor: "#080707",
        cssVariables: {
            "--col-bg": "#ffb75d",
            "--col-text": "#080707",
        }
    },
    {
        title: "Darkblue",
        bgColor: "#253045",
        textColor: "#fff",
        cssVariables: {
            "--col-bg": "#253045",
            "--col-text": "#fff"
        }
    }
];

module.exports = {
    getAvailableThemes: _ => THEMES,
    getCurrentTheme: _ => {
        let selectedTheme = LocalStorage.getItem(LocalEntities.ACTIVE_THEME);
        return !!selectedTheme ? selectedTheme : THEMES[0];
    },
    applyTheme: theme => {
        LocalStorage.setItem({key: LocalEntities.ACTIVE_THEME, value: theme});
        let root = document.documentElement;
        Object.keys(theme.cssVariables).forEach(propName => {
            root.style.setProperty(propName, theme.cssVariables[propName]);
        });
    }
};