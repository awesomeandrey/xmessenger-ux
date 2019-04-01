import {performRequest as callRestApi, API_SERVER_URL, DEFAULT_HEADERS} from "./client-util";
import {SessionStorage, SessionEntities} from "../../services/utility/StorageService";
import {Navigation} from "../../services/utility/NavigationService";

const _TOKEN_HEADER_NAME = "Authorization", _TOKEN_PREFIX = "Bearer ", _retrieveBearerToken = headers => {
    let headerValue = headers.get(_TOKEN_HEADER_NAME);
    return headerValue.split(_TOKEN_PREFIX)[1];
};

const API_BASE_PATH = "/api",
    tokenExists = _ => !!SessionStorage.getItem(SessionEntities.JWT_TOKEN),
    revokeClient = _ => SessionStorage.removeItem(SessionEntities.JWT_TOKEN);

module.exports = {
    API_BASE_PATH, tokenExists, revokeClient,
    authenticateClient: ({url, method = "POST", body = "", headers = DEFAULT_HEADERS}) => {
        return fetch(API_SERVER_URL.concat(url), {
            method: method,
            body: JSON.stringify(body),
            headers: headers
        }).then(response => {
            if (response.ok) {
                let token = _retrieveBearerToken(response.headers);
                SessionStorage.setItem({key: SessionEntities.JWT_TOKEN, value: token});
                return true;
            } else if (response.status === 401) {
                SessionStorage.removeItem(SessionEntities.JWT_TOKEN);
                return Promise.reject("Bad credentials.");
            } else {
                throw "Unknown error occurred when authenticating client."
            }
        });
    },
    performRequest: ({method, entity, path, headers = DEFAULT_HEADERS}) => {
        const token = SessionStorage.getItem(SessionEntities.JWT_TOKEN);
        if (!!token) {
            headers[_TOKEN_HEADER_NAME] = _TOKEN_PREFIX + token;
        } else {
            Navigation.toLogin({jwtExpired: true});
        }
        return callRestApi({
            url: API_BASE_PATH + path,
            method: method,
            body: entity,
            headers: headers
        }).then(data => Promise.resolve(data), error => {
            if ([401, 403].includes(error.status) || error.message.includes("expired")) {
                revokeClient();
                Navigation.toLogin({jwtExpired: true});
            }
            return Promise.reject(error);
        });
    }
};