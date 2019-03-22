import {performRequest as callRestApi} from "./client-util";

const API_BASE_PATH = "/open-api";

module.exports = {
    API_BASE_PATH,
    performRequest: ({method, entity, path, headers}) => {
        return callRestApi({
            url: API_BASE_PATH + path,
            method: method,
            body: entity,
            headers: headers
        });
    }
};