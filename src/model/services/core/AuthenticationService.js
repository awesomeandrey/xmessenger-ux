import {API_BASE_PATH, authenticateClient} from "../../api/rest/secureApi";
import {performRequest} from "../../api/rest/openApi";
import {SessionStorage} from "../utility/StorageService";
import {Navigation} from "../utility/NavigationService";

export const LoginService = {
    loginUser: rawCredentials => authenticateClient({url: `${API_BASE_PATH}/login`, body: rawCredentials})
        .then(_ => Navigation.toHome({})),
    logoutUser: _ => {
        SessionStorage.clear();
        Navigation.toLogin({});
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