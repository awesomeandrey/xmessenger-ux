import {API_BASE_PATH, authenticateClient, performRequest as performSecureRequest} from "../../api/rest/secureApi";
import {performRequest} from "../../api/rest/openApi";
import {SessionStorage} from "../utility/StorageService";
import {Navigation} from "../utility/NavigationService";
import {dropServiceWorkerState, serviceWorkerAllowed} from "../../api/streaming/services/ServiceWorkerRegistrator";
import {CustomEvents} from "../utility/EventsService";

import ApplicationEvents from "../../application-events";

export const LoginService = {
    loginUser: rawCredentials => authenticateClient({url: `${API_BASE_PATH}/login`, body: rawCredentials})
        .then(_ => Navigation.toHome({})),
    logoutUser: sessionExpired => {
        CustomEvents.fire({eventName: ApplicationEvents.APP_DEFAULT.LOADING, detail: {loading: true}})
            .then(_ => serviceWorkerAllowed ? dropServiceWorkerState() : performSecureRequest({
                method: "POST",
                path: "/user/logout"
            }))
            .finally(_ => {
                SessionStorage.clear();
                Navigation.toLogin({jwtExpired: sessionExpired});
            });
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