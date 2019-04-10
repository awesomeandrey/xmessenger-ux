import {API_SERVER_URL} from "../../api/rest/client-util";
import {performRequest} from "../../api/rest/secureApi";
import {API_BASE_PATH as OPEN_API_PATH} from "../../api/rest/openApi";

export const UserService = {
    getCurrentUser: _ => performRequest({
        method: "GET",
        path: "/user/info"
    }),
    composeUserPictureUrl: (user, refresh = false) => {
        let pictureUrl = `${OPEN_API_PATH}/user/${user.id}/picture`;
        if (refresh) {
            const cacheBreaker = new Date().getTime();
            pictureUrl = pictureUrl.concat("?t=" + cacheBreaker);
        }
        return API_SERVER_URL.concat(pictureUrl);
    },
    findUsers: query => {
        let criteria = query, searchByLogin = false;
        if (criteria.startsWith("@")) {
            criteria = criteria.substr(1);
            searchByLogin = true;
        }
        return performRequest({
            method: "GET",
            path: `/user/search?nameOrLogin=${criteria}&searchByLogin=${searchByLogin}`
        });
    }
};

export const Settings = {
    changeProfileInfo: userToUpdate => performRequest({
        method: "PUT",
        path: "/user/info",
        entity: userToUpdate
    }),
    changePicture: formDataObj => performRequest({
        method: "POST",
        path: "/user/picture",
        entity: formDataObj,
        headers: {}
    }),
    changePassword: rawCredentials => performRequest({
        method: "PUT",
        path: "/user/password",
        entity: rawCredentials
    })
};