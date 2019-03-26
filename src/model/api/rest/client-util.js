const _parseJSON = response => response.text().then(rawText => rawText ? JSON.parse(rawText) : {});
const _handleSuccess = response => _parseJSON(response).then(data => Promise.resolve(data));
const _handleError = response => _parseJSON(response).then(error => Promise.reject(error));

const API_SERVER_URL = process.env.XM_API_SERVER_URL;
debugger;
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