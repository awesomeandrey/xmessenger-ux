import {API_SERVER_URL} from "../../constants";
import {performRequest as callRestApi, performRawRequest, DEFAULT_HEADERS} from "./client-util";
import {SessionStorage, SessionEntities} from "../../services/utility/StorageService";
import {CustomEvents} from "../../services/utility/EventsService";

import ApplicationEvents from "../../application-events";

const _retrieveBearerToken = headers => {
    let headerValue = headers.get(TOKEN_HEADER_NAME);
    return headerValue.split(TOKEN_PREFIX)[1];
};

export const TOKEN_HEADER_NAME = "Authorization", TOKEN_PREFIX = "Bearer ";

export const API_BASE_PATH = "/api";

export const getToken = _ => SessionStorage.getItem(SessionEntities.JWT_TOKEN);

export const tokenExists = _ => !!getToken();

/**
 * If successful authenticates client returning JWT token in 'Authorization' header.
 * @param url - resource URL address;
 * @param method - http method;
 * @param body - payload;
 * @param headers - http headers;
 * @returns Promise.
 */
export const authenticateClient = ({url, method = "POST", body = "", headers}) => {
    return performRawRequest(API_SERVER_URL)({
        url, method, headers, body
    }).then(response => {
        SessionStorage.removeItem(SessionEntities.JWT_TOKEN);
        if (response.ok) {
            SessionStorage.setItem({key: SessionEntities.JWT_TOKEN, value: _retrieveBearerToken(response.headers)});
            return Promise.resolve(true);
        } else {
            return Promise.reject({message: "Bad credentials."});
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
export const performRequest = ({method, entity: body, path, headers = DEFAULT_HEADERS}) => {
    headers[TOKEN_HEADER_NAME] = TOKEN_PREFIX + getToken();
    return callRestApi(API_SERVER_URL)({
        url: API_BASE_PATH + path,
        method, headers, body,
    }).then(data => Promise.resolve(data), error => {
        if ([401, 403].includes(error.status)) {
            CustomEvents.fire({eventName: ApplicationEvents.USER.SESSION_EXPIRED});
        }
        return Promise.reject(error);
    });
};