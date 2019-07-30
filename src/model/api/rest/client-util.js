import fetch from "node-fetch";
import FormData from "form-data";
import ToastEvents from "../../../components/common/components/toasts/toasts-events";

import {API_SERVER_URL} from "../../constants";
import {CustomEvents} from "../../services/utility/EventsService";

const _parseJSON = response => response.text().then(rawText => rawText ? JSON.parse(rawText) : {});
const _handleSuccess = response => _parseJSON(response).then(data => Promise.resolve(data));
const _handleError = response => _parseJSON(response).then(error => Promise.reject(error));
const _performRequest = endpoint => parameters => {
    const defaultMethod = "GET", {url, method = defaultMethod, body = "", headers = {}} = parameters,
        isBinaryData = body instanceof FormData, requestBody = {
            method: method,
            body: method === defaultMethod ? undefined : isBinaryData ? body : JSON.stringify(body),
            headers
        };
    return fetch(endpoint.concat(url), requestBody).then(response => {
        if (response.ok) {
            return _handleSuccess(response);
        } else {
            return _handleError(response);
        }
    }).catch(handleFetchIssue);
};

export const DEFAULT_HEADERS = {"Content-Type": "application/json;charset=UTF-8"};

export const performRequest = parameters => {
    return _performRequest(API_SERVER_URL)(parameters);
};

export const performRequestLocally = parameters => {
    return _performRequest("")(parameters);
};

export const handleFetchIssue = error => {
    if (TypeError.prototype.isPrototypeOf(error)) {
        let errorText = "Couldn't perform request due to network issues.";
        console.warn(errorText, JSON.stringify(error));
        CustomEvents.fire({eventName: ToastEvents.SHOW, detail: {message: errorText}});
    }
    return Promise.reject(error);
};