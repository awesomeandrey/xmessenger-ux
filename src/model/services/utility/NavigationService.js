import {SessionStorage} from "./StorageService";

export const Navigation = {
    toLogin: ({jwtExpired = false}) => {
        if (jwtExpired) SessionStorage.clear();
        window.location.href = `/login${jwtExpired ? "?expired=1" : ""}`;
    },
    toHome: ({replace = false}) => {
        if (replace) {
            // Remove the URL from the browser’s history;
            window.location.replace("/home");
        } else {
            window.location.href = "/home";
        }
    },
    toError: _ => {
        window.location.href = "/error";
    },
    toCustom: ({url, replace = false}) => {
        if (replace) {
            // Remove the URL from the browser’s history;
            window.location.replace(url);
        } else {
            window.location = url;
        }
    }
};

export const GITHUB_REPO_URL = "https://github.com/awesomeandrey/xmessenger-ux";