import {API_BASE_PATH, authenticateClient} from "../../api/rest/secureApi";
import {performRequest} from "../../api/rest/openApi";
import {SessionStorage} from "../utility/StorageService";

export const LoginService = {
    loginUser: rawCredentials => authenticateClient({url: `${API_BASE_PATH}/login`, body: rawCredentials}),
    logoutUser: _ => SessionStorage.clear()
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