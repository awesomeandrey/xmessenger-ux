Date.prototype.timeNow = date => {
    const hours = (date.getHours() < 10 ? "0" : "") + date.getHours(),
        minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    return hours + ":" + minutes;
};
Date.prototype.isSameDay = function (date) {
    return this.getYear() === date.getYear()
        && this.getMonth() === date.getMonth()
        && this.getDate() === date.getDate();
};

export const Utility = {
    formatDate: ({dateNum, showTimestamp = true}) => {
        if (!dateNum || isNaN(dateNum)) return "";
        const date = new Date(dateNum), currentDate = new Date();
        if (currentDate.isSameDay(date)) {
            return date.timeNow(date); // "15:23";
        } else if (!showTimestamp) {
            return date.toLocaleDateString(); // "4/7/2019";
        } else {
            return date.toLocaleString(); // "20/7/2019, 12:20:16 AM";
        }
    },
    formatUserInfo: function (user) {
        return user.name.concat(" - ").concat(this.decorateUsername(user.username));
    },
    decorateUsername: p => "@".concat(p),
    join: (...classNames) => classNames.join(" "),
    generateUniqueId: _ => Math.random().toString(36).substr(2, 9),
    hashString: str => {

        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash += Math.pow(str.charCodeAt(i) * 31, str.length - i);
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    },
    matches: (value, patternObj) => {
        if (patternObj === undefined || value === undefined) {
            throw "'value' and 'patternObj' parameters shouldn't be empty.";
        }
        let regExp = new RegExp(patternObj.exp);
        return regExp.test(value.trim());
    },
    isObjectEmpty: prop => prop === null || prop === undefined || (prop.hasOwnProperty("length") && prop.length === 0) || (prop.constructor === Object && Object.keys(prop).length === 0),
    isMobileDevice: _ => !!(navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i)),
    getParamFromUrl: ({paramName, rawUrl = window.location.href}) => {
        const match = rawUrl.match("[?&#]" + paramName + "=([^&]+)");
        return match ? decodeURIComponent(match[1]) : null;
    },
    appendDateStamp: dateNum => {
        const dateString = Utility.formatDate({dateNum, showTimestamp: false});
        return !!dateString ? (" • " + dateString) : "";
    },
    scrollToBottom: (element) => {
        if (!!element) {
            element["scrollTop"] = element["scrollHeight"];
        } else {
            window.scrollTo(0, document.body.scrollHeight);
        }
    },
    scrollToTop: (element) => {
        if (!!element) {
            element["scrollTop"] = 0;
        } else {
            window.scrollTo({top: 0, behavior: "smooth"});
        }
    }
};

export const InputPatterns = {
    NAME: {exp: "^[a-zA-Z ]{2,20}$", errorMessage: "Invalid Name"},
    LOGIN: {exp: "^[a-zA-Z0-9]{4,10}", errorMessage: "Invalid Login"},
    PASSWORD: {exp: "[^ ]{4,30}", errorMessage: "Invalid Password"},
    EMAIL: {exp: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$", errorMessage: "Invalid Email address"},
    MESSAGE_BODY: {exp: "^[a-zA-Z0-9А-Яа-яєі]{1,400}", errorMessage: "Invalid message body"}
};