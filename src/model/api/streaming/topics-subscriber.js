import SockJS from "sockjs-client";

import {API_SERVER_URL} from "../rest/client-util";
import {Stomp} from "stompjs/lib/stomp.js";

const subscribeToTopics = registrations => {
    let socket = SockJS(API_SERVER_URL.concat("/ws-configurator")), stompClient = Stomp.over(socket);
    stompClient.debug = null; // disable logging;
    stompClient.connect({}, frame => {
        registrations.forEach(registration => {
            stompClient.subscribe(registration.route, registration.callback);
        });
    });
};

module.exports = subscribeToTopics;