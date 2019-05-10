import {API_SERVER_URL} from "../../constants";

const _parseJSON = response => response.text().then(rawText => rawText ? JSON.parse(rawText) : {});
const _handleSuccess = response => _parseJSON(response).then(data => Promise.resolve(data));
const _handleError = response => _parseJSON(response).then(error => Promise.reject(error));
const _performRequest = endpoint => parameters => {
    const {url, method = "GET", body = "", headers = DEFAULT_HEADERS} = parameters,
        isBinaryData = body instanceof FormData, requestBody = {
            method: method,
            body: method === "GET" ? undefined : isBinaryData ? body : JSON.stringify(body),
            headers: headers
        };
    return fetch(endpoint.concat(url), requestBody).then(response => {
        if (response.ok) {
            return _handleSuccess(response);
        } else {
            return _handleError(response);
        }
    });
};

export const DEFAULT_HEADERS = {"Content-Type": "application/json;charset=UTF-8"};

export const performRequest = parameters => {
    return _performRequest(API_SERVER_URL)(parameters);
};

export const performRequestLocally = parameters => {
    return _performRequest("")(parameters);
};