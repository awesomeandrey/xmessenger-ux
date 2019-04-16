import {LocalEntities, LocalStorage} from "../../../../../model/services/utility/StorageService";

export const THEMES = {
    DEFAULT: {
        title: "Default",
        className: "theme-default"
    },
    GREEN: {
        title: "Green",
        className: "theme-green"
    },
    ORANGE: {
        title: "Orange",
        className: "theme-orange"
    },
    DARKBLUE: {
        title: "Darkblue",
        className: "theme-darkblue"
    },
};

export const ON_APPLY_THEME = "onApplyTheme";

export const getCurrentTheme = _ => {
    const selectedTheme = LocalStorage.getItem(LocalEntities.ACTIVE_THEME);
    return !!selectedTheme ? selectedTheme : THEMES.DEFAULT;
};