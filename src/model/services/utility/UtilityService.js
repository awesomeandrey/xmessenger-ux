module.exports = {
    Utility: {
        formatDate: ({dateNum, showTimestamp = true}) => {
            if (!dateNum || isNaN(dateNum)) return "";
            let date = new Date(dateNum), currentDate = new Date();
            if (date.getYear() === currentDate.getYear()
                && date.getMonth() === currentDate.getMonth()
                && date.getDate() === currentDate.getDate()) {
                Date.prototype.timeNow = d => {
                    let h = (d.getHours() < 10 ? '0' : '') + d.getHours(),
                        m = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
                    return h + ':' + m;
                };
                return date.timeNow(date);
            } else if (!showTimestamp) {
                return date.toLocaleDateString();
            } else {
                return date.toLocaleString();
            }
        },
        decorateUsername: (username) => {
            return "@".concat(username);
        },
        join: (...classNames) => {
            return classNames.join(" ");
        },
        generateHashValue: (...parameters) => {
            let hash = 0, timestamp = new Date().getTime();
            parameters.forEach(param => {
                if (param === undefined || param === null) {
                    throw "Parameter shouldn't be null or undefined when generating hash value."
                } else {
                    param = typeof param === 'string' ? param : JSON.stringify(param);
                    for (let i = 0; i < param.length; i++) {
                        let character = param.charCodeAt(i);
                        hash = ((hash << 5) - hash) + character;
                        hash = hash & hash; // Convert to 32bit integer;
                    }
                }
            });
            return timestamp + (hash < 0 ? hash * (-1) : hash);
        },
        check: (value, patternObj) => {
            if (patternObj === undefined || value === undefined) {
                throw "'Value' and 'pattern' parameters shouldn't be empty.";
            }
            let regExp = new RegExp(patternObj.exp);
            return regExp.test(value);
        },
        isObjectEmpty: prop =>
            prop === null || prop === undefined ||
            (prop.hasOwnProperty("length") && prop.length === 0) ||
            (prop.constructor === Object && Object.keys(prop).length === 0),
        isMobileDevice: _ => {
            return !!(navigator.userAgent.match(/Android/i)
                || navigator.userAgent.match(/iPhone/i)
                || navigator.userAgent.match(/iPod/i)
                || navigator.userAgent.match(/BlackBerry/i));
        },
        getParamFromUrl: ({paramName, rawUrl = window.location.href}) => {
            const match = rawUrl.match("[?&#]" + paramName + "=([^&]+)");
            return match ? decodeURIComponent(match[1]) : null;
        }
    },
    InputPatterns: {
        NAME: {exp: "^[a-zA-Z ]{2,30}$", errorMessage: "Invalid Name"},
        LOGIN: {exp: "^[a-zA-Z0-9]{4,}", errorMessage: "Invalid Login"},
        PASSWORD: {exp: "[^ ]{4,}", errorMessage: "Invalid Password"},
        MESSAGE_BODY: {exp: "^[a-zA-Z0-9А-Яа-яєі]{1,}", errorMessage: "Invalid message body"}
    }
};