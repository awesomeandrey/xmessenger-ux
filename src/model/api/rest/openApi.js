import {performRequest as callRestApi} from "./client-util";

export const API_BASE_PATH = "/open-api";

export const performRequest = ({method, entity, path, headers}) => {
    return callRestApi({
        url: API_BASE_PATH + path,
        method: method,
        body: entity,
        headers: headers
    });
};