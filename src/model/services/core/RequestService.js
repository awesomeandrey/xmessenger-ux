import {performRequest} from "../../api/rest/secureApi";

module.exports = {
    RequestService: {
        getRequests: _ => performRequest({
            method: "GET",
            path: "/requests/"
        }),
        processRequest: request => performRequest({
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
    }
};