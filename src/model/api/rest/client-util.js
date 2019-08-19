import fetch from "node-fetch";
import FormData from "form-data";
import ToastEvents from "../../../components/common/components/toasts/toasts-events";

import {CustomEvents} from "../../services/utility/EventsService";

const _parseJSON = response => response.text().then(rawText => rawText ? JSON.parse(rawText) : {});

export const DEFAULT_HEADERS = {"Content-Type": "application/json;charset=UTF-8"};

export const handleSuccess = response => _parseJSON(response).then(data => Promise.resolve(data));

export const handleError = response => _parseJSON(response).then(error => Promise.reject(error));

export const performLocalRequest = parameters => {
    return performRequest("")(parameters);
};

export const performRequest = endpoint => parameters => {
    return performRawRequest(endpoint)(parameters).then(response => {
        if (response.ok) {
            // HTTP codes [200, 201];
            return handleSuccess(response);
        } else {
            // Any other HTTP codes;
            return handleError(response);
        }
    });
};

export const performRawRequest = endpoint => parameters => {
    const defaultMethod = "GET";
    const {url, method = defaultMethod, body = "", headers = DEFAULT_HEADERS} = parameters;
    const isBinaryData = body instanceof FormData, requestBody = {
        method, headers, body: method === defaultMethod ? undefined : isBinaryData ? body : JSON.stringify(body),
    };
    return fetch(endpoint.concat(url), requestBody).catch(connectionError => {
        let errorText = "Couldn't perform request due to network issues.";
        console.warn(errorText, JSON.stringify(connectionError));
        CustomEvents.fire({eventName: ToastEvents.SHOW, detail: {message: errorText}});
    });
};