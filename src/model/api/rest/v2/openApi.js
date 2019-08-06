import {API_SERVER_URL} from "../../../constants";
import {performRequest as callRestApi} from "./client-util";

export const API_BASE_PATH = "/open-api";

export const performRequest = ({method, path, headers, entity: body}) => {
    return callRestApi(API_SERVER_URL)({
        url: API_BASE_PATH + path,
        method, body, headers
    });
};