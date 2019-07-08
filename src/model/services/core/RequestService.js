import {performRequest} from "../../api/rest/secureApi";

export default {
    getRequests: _ => performRequest({
        method: "GET",
        path: "/requests"
    }),
    respondToRequest: request => performRequest({
        method: "PUT",
        path: "/requests/process",
        entity: request
    }),
    sendRequest: targetUser => performRequest({
        method: "POST",
        path: "/requests/send",
        entity: {
            recipient: targetUser
        }
    })
};