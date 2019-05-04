import {authenticateClient} from "../../api/rest/secureApi";
import {performRequest, API_BASE_PATH} from "../../api/rest/openApi";

const SERVICE_PATH = "/oauth/gmail";

export default {
    requestTokenUrl: _ => performRequest({
        path: `${SERVICE_PATH}/composeTokenUrl?host=${window.location.origin}`,
        headers: {"Content-Type": "text/plain"}
    }),
    authenticate: accessToken => !!accessToken
        ? authenticateClient({
            url: `${API_BASE_PATH + SERVICE_PATH}/login`,
            body: accessToken
        }) : Promise.reject("Access token not provided.")
};