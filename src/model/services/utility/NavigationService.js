module.exports = {
    Navigation: {
        toLogin: ({jwtExpired = false}) => {
            window.location.href = `/login${jwtExpired ? "?expired" : ""}`;
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
    },
    ExternalResources: {
        GITHUB_REPO_URL: "https://github.com/awesomeandrey/xMessenger"
    }
};