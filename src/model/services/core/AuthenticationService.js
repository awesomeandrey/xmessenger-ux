import {API_BASE_PATH, authenticateClient, revokeClient} from "../../api/rest/secureApi";
import {performRequest} from "../../api/rest/openApi";

// TODO - notify on 'login'/'logout' event;
export const LoginService = {
    login: rawCredentials => authenticateClient({url: `${API_BASE_PATH}/login`, body: rawCredentials}),
    logout: _ => {
        revokeClient();
        return Promise.resolve(true);
    }
};

export const RegistrationService = {
    checkUsername: usernameToCheck => performRequest({
        method: "POST",
        path: "/sign-up/username",
        entity: usernameToCheck
    }),
    register: userToRegister => performRequest({
        method: "POST",
        path: "/sign-up",
        entity: userToRegister
    })
};