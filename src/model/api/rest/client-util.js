const _parseJSON = response => response.text().then(rawText => rawText ? JSON.parse(rawText) : {});
const _handleSuccess = response => _parseJSON(response).then(data => Promise.resolve(data));
const _handleError = response => _parseJSON(response).then(error => Promise.reject(error));

/**
 * 'XM_API_SERVER_URL' variable is provided by Webpack configuration file.
 */
const API_SERVER_URL = XM_API_SERVER_URL;
const DEFAULT_HEADERS = {"Content-Type": "application/json;charset=UTF-8"};

module.exports = {
    API_SERVER_URL, DEFAULT_HEADERS,
    performRequest: parameters => {
        const {url, method = "GET", body = "", headers = DEFAULT_HEADERS} = parameters,
            isBinaryData = body instanceof FormData, requestBody = {
                method: method,
                body: method === "GET" ? undefined : isBinaryData ? body : JSON.stringify(body),
                headers: headers
            };
        return fetch(API_SERVER_URL.concat(url), requestBody).then(response => {
            if (response.ok) {
                return _handleSuccess(response);
            } else {
                return _handleError(response);
            }
        });
    }
};