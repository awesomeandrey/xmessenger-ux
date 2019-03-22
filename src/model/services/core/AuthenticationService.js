import {API_BASE_PATH, authenticateClient, revokeClient} from "../../api/rest/secureApi";
import {performRequest} from "../../api/rest/openApi";

module.exports = {
    LoginService: {
        login: rawCredentials => authenticateClient({url: `${API_BASE_PATH}/login`, body: rawCredentials}),
        logout: _ => {
            revokeClient();
            return Promise.resolve(true);
        }
    },
    RegistrationService: {
        checkUsernameForUniqueness: usernameToCheck => performRequest({
            method: "POST",
            path: "/sign-up/username",
            entity: usernameToCheck
        }),
        register: userToRegister => performRequest({
            method: "POST",
            path: "/sign-up",
            entity: userToRegister
        })
    }
};