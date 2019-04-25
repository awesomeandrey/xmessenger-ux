import {performRequest as callRestApi, API_SERVER_URL, DEFAULT_HEADERS} from "./client-util";
import {SessionStorage, SessionEntities} from "../../services/utility/StorageService";
import {Navigation} from "../../services/utility/NavigationService";

const _TOKEN_HEADER_NAME = "Authorization", _TOKEN_PREFIX = "Bearer ", _retrieveBearerToken = headers => {
    let headerValue = headers.get(_TOKEN_HEADER_NAME);
    return headerValue.split(_TOKEN_PREFIX)[1];
};

export const API_BASE_PATH = "/api",
    getToken = _ => SessionStorage.getItem(SessionEntities.JWT_TOKEN),
    tokenExists = _ => !!getToken(),
    revokeClient = _ => SessionStorage.removeItem(SessionEntities.JWT_TOKEN);

/**
 * If successful authenticates client returning JWT token
 * in 'Authorization' header.
 * @param url - resource URL address;
 * @param method - http method;
 * @param body - payload;
 * @param headers - http headers;
 * @returns Javascript Promise.
 */
export const authenticateClient = ({url, method = "POST", body = "", headers = DEFAULT_HEADERS}) => {
    return fetch(API_SERVER_URL.concat(url), {
        method: method,
        body: JSON.stringify(body),
        headers: headers
    }).then(response => {
        if (response.ok) {
            SessionStorage.setItem({key: SessionEntities.JWT_TOKEN, value: _retrieveBearerToken(response.headers)});
            return Promise.resolve(true);
        } else {
            SessionStorage.removeItem(SessionEntities.JWT_TOKEN);
            return Promise.reject("Bad credentials.");
        }
    });
};

/**
 * Performs request supplying it with JWT token.
 * @param method
 * @param entity
 * @param path
 * @param headers
 * @returns In case of non-authorized operation it navigates to auth page.
 */
export const performRequest = ({method, entity, path, headers = DEFAULT_HEADERS}) => {
    headers[_TOKEN_HEADER_NAME] = _TOKEN_PREFIX + getToken();
    return callRestApi({
        url: API_BASE_PATH + path,
        method: method,
        body: entity,
        headers: headers
    }).then(data => Promise.resolve(data), error => {
        if ([400, 401, 403].includes(error.status)) {
            revokeClient();
            Navigation.toLogin({jwtExpired: true});
        }
        return Promise.reject(error);
    });
};