import {authenticateClient} from "../../api/rest/secureApi";
import {performRequest, API_BASE_PATH} from "../../api/rest/openApi";

const API_ENDPOINT = "/oauth/gmail";

export default {
    requestTokenUrl: _ => performRequest({
        path: `${API_ENDPOINT}/composeTokenUrl?host=${window.location.origin}`,
        headers: {"Content-Type": "text/plain"}
    }),
    authenticate: accessToken => !!accessToken
        ? authenticateClient({
            url: `${API_BASE_PATH + API_ENDPOINT}/login`,
            body: accessToken
        }) : Promise.reject("Access token not provided.")
};