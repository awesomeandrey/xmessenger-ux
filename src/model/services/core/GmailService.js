import {authenticateClient} from "../../api/rest/secureApi";
import {performRequest, API_BASE_PATH} from "../../api/rest/openApi";

const API_ENDPOINT = "/oauth/gmail";

module.exports = {
    OAuthService: {
        composeTokenUrl: _ => performRequest({
            path: `${API_ENDPOINT}/composeTokenUrl?host=${window.location.origin}`,
            headers: {"Content-Type": "text/plain"}
        }),
        parseUrlFromAuthorizationServer: urlString => {
            if (!!urlString) {
                const payload = {};
                urlString.split("&").forEach(entry => {
                    let item = entry.split("=");
                    payload[item[0]] = decodeURIComponent(item[1]);
                });
                return payload;
            } else {
                return null;
            }
        },
        login: accessToken => {
            return authenticateClient({url: `${API_BASE_PATH + API_ENDPOINT}/login?accessToken=${accessToken}`});
        }
    }
};